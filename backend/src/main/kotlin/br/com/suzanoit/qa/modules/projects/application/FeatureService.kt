package br.com.suzanoit.qa.modules.projects.application

import br.com.suzanoit.qa.modules.shared.domain.Feature
import br.com.suzanoit.qa.modules.shared.domain.FeatureRepository
import org.springframework.stereotype.Service

@Service
class FeatureService(private val repository: FeatureRepository) {
    fun createFeature(feature: Feature): Feature = repository.save(feature)
    fun getFeature(id: String): Feature? = repository.findById(id)
    fun getAllFeatures(): List<Feature> = repository.findAll()
    fun deleteFeature(id: String) = repository.delete(id)
}