package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.Defect
import br.com.suzanoit.qa.core.domain.DefectRepository
import org.springframework.stereotype.Service

@Service
class DefectService(private val repository: DefectRepository) {
    fun createDefect(defect: Defect): Defect = repository.save(defect)
    fun getDefect(id: String): Defect? = repository.findById(id)
    fun getAllDefects(): List<Defect> = repository.findAll()
    fun updateDefect(id: String, defect: Defect): Defect? {
        val existing = repository.findById(id) ?: return null
        val updated = existing.copy(
            title = defect.title,
            description = defect.description,
            severity = defect.severity,
            status = defect.status
        )
        return repository.save(updated)
    }
    fun deleteDefect(id: String) = repository.delete(id)
}
