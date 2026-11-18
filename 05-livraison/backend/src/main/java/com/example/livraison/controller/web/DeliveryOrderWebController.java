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
@RequestMapping("/orders")
public class DeliveryOrderWebController {
    // Pages web de consultation et de gestion des commandes à livrer.
    private final ApplicationService service;

    public DeliveryOrderWebController(ApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public String list(@RequestParam(defaultValue = "") String q, @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "") String filter, Pageable pageable, Model m) {
        prepare(m);
        m.addAttribute("page", service.listDeliveryOrder(q, status, filter, pageable));
        m.addAttribute("q", q);
        m.addAttribute("status", status);
        m.addAttribute("filter", filter);
        m.addAttribute("title", "Commandes");
        m.addAttribute("path", "/orders");
        return "deliveryorder-list";
    }

    private void prepare(Model m) {
        m.addAttribute("title", "Commandes");
        m.addAttribute("path", "/orders");
        m.addAttribute("clientIdChoices", service.listClient("", "", "", PageRequest.of(0, 100)).content());

    }

    @GetMapping("/new")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','OPERATOR')")
    public String form(Model m) {
        prepare(m);
        m.addAttribute("editing", false);
        return "deliveryorder-form";
    }

    @GetMapping("/{id}/edit")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public String edit(@PathVariable Long id, Model m) {
        prepare(m);
        m.addAttribute("editing", true);
        m.addAttribute("id", id);
        m.addAttribute("record", service.getDeliveryOrder(id));
        return "deliveryorder-form";
    }

    @GetMapping("/{id}")
    public String detail(@PathVariable Long id, Model m) {
        prepare(m);
        m.addAttribute("record", service.getDeliveryOrder(id));
        m.addAttribute("audit", service.history("DeliveryOrder", id));
        service.detail("DeliveryOrder", id, m);
        return "deliveryorder-detail";
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','OPERATOR')")
    public String save(@Valid @ModelAttribute("record") DeliveryOrderRequest r, BindingResult errors, Model m,
            RedirectAttributes flash) {
        if (errors.hasErrors()) {
            prepare(m);
            m.addAttribute("editing", false);
            m.addAttribute("error", errors.getAllErrors().get(0).getDefaultMessage());
            return "deliveryorder-form";
        }
        try {
            var saved = service.createDeliveryOrder(r);
            flash.addFlashAttribute("success", "Enregistrement créé");
            return "redirect:/orders/" + saved.id();
        } catch (com.example.livraison.exception.BusinessException e) {
            prepare(m);
            m.addAttribute("editing", false);
            m.addAttribute("error", e.getMessage());
            return "deliveryorder-form";
        }
    }

    @PostMapping("/{id}/edit")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public String update(@PathVariable Long id, @Valid @ModelAttribute("record") DeliveryOrderRequest r,
            BindingResult errors, Model m, RedirectAttributes flash) {
        if (errors.hasErrors()) {
            prepare(m);
            m.addAttribute("editing", true);
            m.addAttribute("id", id);
            m.addAttribute("error", errors.getAllErrors().get(0).getDefaultMessage());
            return "deliveryorder-form";
        }
        try {
            service.updateDeliveryOrder(id, r);
            flash.addFlashAttribute("success", "Modifications enregistrées");
            return "redirect:/orders/" + id;
        } catch (com.example.livraison.exception.BusinessException e) {
            prepare(m);
            m.addAttribute("editing", true);
            m.addAttribute("id", id);
            m.addAttribute("error", e.getMessage());
            return "deliveryorder-form";
        }
    }

    @PostMapping("/{id}/delete")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public String delete(@PathVariable Long id, RedirectAttributes flash) {
        service.deleteDeliveryOrder(id);
        flash.addFlashAttribute("success", "Enregistrement supprimé");
        return "redirect:/orders";
    }
}
