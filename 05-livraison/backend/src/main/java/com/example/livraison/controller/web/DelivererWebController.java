package com.example.livraison.controller.web;

import com.example.livraison.service.ApplicationService;
import com.example.livraison.dto.request.*;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;

@Controller
@RequestMapping("/deliverers")
public class DelivererWebController {
    // Gère les pages web des livreurs et de leurs capacités.
    private final ApplicationService service;

    public DelivererWebController(ApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public String list(@RequestParam(defaultValue = "") String q, @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "") String filter, Pageable pageable, Model m) {
        prepare(m);
        m.addAttribute("page", service.listDeliverer(q, status, filter, pageable));
        m.addAttribute("q", q);
        m.addAttribute("status", status);
        m.addAttribute("filter", filter);
        m.addAttribute("title", "Livreurs");
        m.addAttribute("path", "/deliverers");
        return "deliverer-list";
    }

    private void prepare(Model m) {
        m.addAttribute("title", "Livreurs");
        m.addAttribute("path", "/deliverers");

    }

    @GetMapping("/new")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','OPERATOR')")
    public String form(Model m) {
        prepare(m);
        m.addAttribute("editing", false);
        return "deliverer-form";
    }

    @GetMapping("/{id}/edit")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public String edit(@PathVariable Long id, Model m) {
        prepare(m);
        m.addAttribute("editing", true);
        m.addAttribute("id", id);
        m.addAttribute("record", service.getDeliverer(id));
        return "deliverer-form";
    }

    @GetMapping("/{id}")
    public String detail(@PathVariable Long id, Model m) {
        prepare(m);
        m.addAttribute("record", service.getDeliverer(id));
        m.addAttribute("audit", service.history("Deliverer", id));
        service.detail("Deliverer", id, m);
        return "deliverer-detail";
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','OPERATOR')")
    public String save(@Valid @ModelAttribute("record") DelivererRequest r, BindingResult errors, Model m,
            RedirectAttributes flash) {
        if (errors.hasErrors()) {
            prepare(m);
            m.addAttribute("editing", false);
            m.addAttribute("error", errors.getAllErrors().get(0).getDefaultMessage());
            return "deliverer-form";
        }
        try {
            var saved = service.createDeliverer(r);
            flash.addFlashAttribute("success", "Enregistrement créé");
            return "redirect:/deliverers/" + saved.id();
        } catch (com.example.livraison.exception.BusinessException e) {
            prepare(m);
            m.addAttribute("editing", false);
            m.addAttribute("error", e.getMessage());
            return "deliverer-form";
        }
    }

    @PostMapping("/{id}/edit")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public String update(@PathVariable Long id, @Valid @ModelAttribute("record") DelivererRequest r,
            BindingResult errors, Model m, RedirectAttributes flash) {
        if (errors.hasErrors()) {
            prepare(m);
            m.addAttribute("editing", true);
            m.addAttribute("id", id);
            m.addAttribute("error", errors.getAllErrors().get(0).getDefaultMessage());
            return "deliverer-form";
        }
        try {
            service.updateDeliverer(id, r);
            flash.addFlashAttribute("success", "Modifications enregistrées");
            return "redirect:/deliverers/" + id;
        } catch (com.example.livraison.exception.BusinessException e) {
            prepare(m);
            m.addAttribute("editing", true);
            m.addAttribute("id", id);
            m.addAttribute("error", e.getMessage());
            return "deliverer-form";
        }
    }

    @PostMapping("/{id}/delete")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public String delete(@PathVariable Long id, RedirectAttributes flash) {
        service.deleteDeliverer(id);
        flash.addFlashAttribute("success", "Enregistrement supprimé");
        return "redirect:/deliverers";
    }
}
