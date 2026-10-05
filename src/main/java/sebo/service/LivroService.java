package sebo.service;

import java.util.List;


import org.springframework.stereotype.Service;

import sebo.model.Livro;
import sebo.repository.LivroRepository;

@Service
public class LivroService {

    private final LivroRepository livroRepository;

    public LivroService(LivroRepository livroRepository) {
        this.livroRepository = livroRepository;
    }

    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    
    public List<Livro> listarDisponiveis() {
        return livroRepository.findAll().stream()
                .filter(livro -> !Boolean.TRUE.equals(livro.getVendido()))
                .toList();
    }

    
    public List<Livro> listarPorUsuario(Long usuarioId) {
        return livroRepository.findByUsuarioId(usuarioId);
    }

    public Livro buscarPorId(Long id) {
        return livroRepository.findById(id).orElse(null);
    }

    public Livro salvar(Livro livro) {
        return livroRepository.save(livro);
    }

   





    
    public Livro alternarVendido(Long id) {

        Livro livro = buscarPorId(id);

        if (livro == null) {
            return null;
        }

        livro.setVendido(!Boolean.TRUE.equals(livro.getVendido()));

        return livroRepository.save(livro);
    }

    public void excluir(Long id) {
        livroRepository.deleteById(id);
    }
}