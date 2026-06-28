package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.ClientService
import br.com.suzanoit.qa.core.domain.Client
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = ["*"])
class ClientController(private val clientService: ClientService) {

    @GetMapping
    fun getAllClients(): List<Client> = clientService.getAllClients()

    @GetMapping("/{id}")
    fun getClient(@PathVariable id: String): ResponseEntity<Client> {
        val client = clientService.getClient(id)
        return if (client != null) ResponseEntity.ok(client) else ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createClient(@RequestBody client: Client): Client = clientService.createClient(client)

    @DeleteMapping("/{id}")
    fun deleteClient(@PathVariable id: String): ResponseEntity<Void> {
        clientService.deleteClient(id)
        return ResponseEntity.noContent().build()
    }
}
