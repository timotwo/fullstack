package sebo.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class SupabaseStorageService {

    private static final Map<String, String> EXTENSOES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.secret-key}")
    private String secretKey;

    @Value("${supabase.bucket}")
    private String bucket;

    private final HttpClient http = HttpClient.newHttpClient();

    public String enviarImagem(MultipartFile arquivo) throws IOException, InterruptedException {

        String tipo = arquivo.getContentType();

        if (tipo == null || !EXTENSOES.containsKey(tipo)) {
            throw new IllegalArgumentException("Envie uma imagem JPG, PNG ou WebP.");
        }

        String nomeArquivo = UUID.randomUUID() + EXTENSOES.get(tipo);

        String base = supabaseUrl.endsWith("/")
                ? supabaseUrl.substring(0, supabaseUrl.length() - 1)
                : supabaseUrl;

        HttpRequest.Builder requisicao = HttpRequest.newBuilder()
                .uri(URI.create(base + "/storage/v1/object/" + bucket + "/" + nomeArquivo))
                .header("apikey", secretKey)
                .header("Content-Type", tipo)
                .POST(HttpRequest.BodyPublishers.ofByteArray(arquivo.getBytes()));

        if (secretKey.startsWith("eyJ")) {
            requisicao.header("Authorization", "Bearer " + secretKey);
        }

        HttpResponse<String> resposta = http.send(
                requisicao.build(),
                HttpResponse.BodyHandlers.ofString()
        );

        if (resposta.statusCode() < 200 || resposta.statusCode() >= 300) {
            throw new IOException(
                    "Falha ao enviar imagem (" + resposta.statusCode() + "): " + resposta.body()
            );
        }

        return base + "/storage/v1/object/public/" + bucket + "/" + nomeArquivo;
    }
}