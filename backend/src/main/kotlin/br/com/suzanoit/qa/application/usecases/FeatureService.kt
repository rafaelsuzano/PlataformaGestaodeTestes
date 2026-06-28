package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.Feature
import br.com.suzanoit.qa.core.domain.FeatureRepository
import org.springframework.stereotype.Service

@Service
class FeatureService(private val repository: FeatureRepository) {
    fun createFeature(feature: Feature): Feature = repository.save(feature)
    fun getFeature(id: String): Feature? = repository.findById(id)
    fun getAllFeatures(): List<Feature> = repository.findAll()
    fun deleteFeature(id: String) = repository.delete(id)
}
