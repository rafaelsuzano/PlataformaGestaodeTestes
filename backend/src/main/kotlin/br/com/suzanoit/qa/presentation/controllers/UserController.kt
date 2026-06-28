package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.UserService
import br.com.suzanoit.qa.core.domain.User
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = ["*"])
class UserController(private val service: UserService) {

    @GetMapping
    fun getAll(): ResponseEntity<List<User>> {
        return ResponseEntity.ok(service.getAllUsers())
    }

    @PostMapping
    fun create(@RequestBody user: User): ResponseEntity<User> {
        return ResponseEntity.ok(service.createUser(user))
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: String, @RequestBody user: User): ResponseEntity<User> {
        val updated = service.updateUser(id, user)
        return if (updated != null) ResponseEntity.ok(updated) else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: String): ResponseEntity<Void> {
        service.deleteUser(id)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/login")
    fun login(@RequestBody credentials: Map<String, String>): ResponseEntity<User> {
        val email = credentials["email"] ?: return ResponseEntity.badRequest().build()
        val password = credentials["password"] ?: return ResponseEntity.badRequest().build()
        
        val user = service.login(email, password)
        return if (user != null) {
            ResponseEntity.ok(user)
        } else {
            ResponseEntity.status(401).build()
        }
    }
}
