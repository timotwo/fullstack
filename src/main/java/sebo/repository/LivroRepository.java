package sebo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import sebo.model.Livro;

public interface LivroRepository extends JpaRepository<Livro, Long> {

    List<Livro> findByUsuarioId(Long usuarioId);
}