package br.com.suzanoit.qa.modules.projects.application


import br.com.suzanoit.qa.modules.projects.presentation.dto.*
import br.com.suzanoit.qa.modules.shared.domain.Feature
import br.com.suzanoit.qa.modules.shared.domain.FeatureRepository
import br.com.suzanoit.qa.modules.shared.domain.exceptions.ResourceNotFoundException
import org.springframework.stereotype.Service

@Service
class FeatureService(private val repository: FeatureRepository) {
    
    fun createFeature(request: CreateFeatureRequest): FeatureResponse {
        val feature = repository.save(request.toDomain())
        return feature.toResponse()
    }
    
    fun getFeature(id: String): FeatureResponse {
        val feature = repository.findById(id) 
            ?: throw ResourceNotFoundException("Feature", "id", id)
        return feature.toResponse()
    }
    
    fun getAllFeatures(): List<FeatureResponse> {
        return repository.findAll().map { it.toResponse() }
    }
    
    fun deleteFeature(id: String) {
        repository.findById(id) ?: throw ResourceNotFoundException("Feature", "id", id)
        repository.delete(id)
    }
}