package br.com.suzanoit.qa

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
@RestController
class SuzanoItQaApplication {

    @GetMapping("/")
    fun healthCheck(): Map<String, String> {
        return mapOf(
            "status" to "UP",
            "service" to "SuzanoIT QA Backend API",
            "message" to "A API está rodando perfeitamente. Para acessar a plataforma visual, utilize a URL do Frontend."
        )
    }
}

fun main(args: Array<String>) {
	runApplication<SuzanoItQaApplication>(*args)
}
