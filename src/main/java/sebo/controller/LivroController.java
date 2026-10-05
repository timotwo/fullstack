package sebo.controller;

import java.util.List;
import java.util.Objects;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import sebo.model.Livro;
import sebo.service.LivroService;
import sebo.service.SupabaseStorageService;

@RestController
@RequestMapping("/livros")
public class LivroController {

    private final LivroService livroService;
    private final SupabaseStorageService storageService;

    public LivroController(LivroService livroService,
                           SupabaseStorageService storageService) {
        this.livroService = livroService;
        this.storageService = storageService;
    }

   
    @GetMapping
    public List<Livro> listarDisponiveis() {
        return livroService.listarDisponiveis();
    }


    @GetMapping("/usuario/{usuarioId}")
    public List<Livro> listarPorUsuario(@PathVariable Long usuarioId) {
        return livroService.listarPorUsuario(usuarioId);
    }

    @GetMapping("/{id}")
    public Livro buscarPorId(@PathVariable Long id) {
        return livroService.buscarPorId(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> salvar(
            @RequestPart("livro") Livro livro,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {

        try {

            if (imagem != null && !imagem.isEmpty()) {
                livro.setImagem(storageService.enviarImagem(imagem));
            }

            return ResponseEntity.ok(livroService.salvar(livro));

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao salvar a imagem.");
        }
    }


    
    @PatchMapping("/{id}/vendido")
    public ResponseEntity<?> alternarVendido(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {

        Livro existente = livroService.buscarPorId(id);

        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        if (!ehDono(existente, usuarioId)) {
            return ResponseEntity.status(403).body("Você não pode alterar esse anúncio");
        }

        return ResponseEntity.ok(livroService.alternarVendido(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {

        Livro existente = livroService.buscarPorId(id);

        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        if (!ehDono(existente, usuarioId)) {
            return ResponseEntity.status(403).body("Você não pode excluir esse anúncio.");
        }

        livroService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private boolean ehDono(Livro livro, Long usuarioId) {
        return livro.getUsuario() != null
                && Objects.equals(livro.getUsuario().getId(), usuarioId);
    }
}