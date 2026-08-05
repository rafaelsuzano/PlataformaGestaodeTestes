package br.com.suzanoit.qa.modules.users.presentation


import br.com.suzanoit.qa.modules.users.application.UserService
import br.com.suzanoit.qa.modules.shared.domain.User
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

    @PostMapping("/forgot-password")
    fun forgotPassword(@RequestBody payload: Map<String, String>): ResponseEntity<Map<String, String>> {
        val email = payload["email"] ?: return ResponseEntity.badRequest().build()
        println("Simulando envio de e-mail de recuperação para: $email")
        return ResponseEntity.ok(mapOf("message" to "Instruções de recuperação enviadas para o e-mail informado (simulado)."))
    }
}