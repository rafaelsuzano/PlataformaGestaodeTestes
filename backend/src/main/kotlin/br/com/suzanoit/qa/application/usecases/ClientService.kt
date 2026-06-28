package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.Client
import br.com.suzanoit.qa.core.domain.ClientRepository
import org.springframework.stereotype.Service

@Service
class ClientService(private val repository: ClientRepository) {
    fun createClient(client: Client): Client = repository.save(client)
    fun getClient(id: String): Client? = repository.findById(id)
    fun getAllClients(): List<Client> = repository.findAll()
    fun deleteClient(id: String) = repository.delete(id)
}
