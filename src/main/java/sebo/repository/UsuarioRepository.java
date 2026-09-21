package sebo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sebo.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}