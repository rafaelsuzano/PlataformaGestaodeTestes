package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.*
import org.springframework.stereotype.Service
import java.util.Locale

@Service
class CoverageService(
    private val requirementRepository: RequirementRepository,
    private val testCaseRepository: TestCaseRepository,
    private val moduleRepository: ModuleRepository,
    private val featureRepository: FeatureRepository
) {

    fun getGlobalCoverage(projectId: String?): List<CoverageGlobalDto> {
        val allReqs = requirementRepository.findAll()
        val allTestCases = testCaseRepository.findAll()

        // Filter by project if provided
        val reqs = if (projectId != null && projectId != "all") {
            allReqs.filter { it.projectId == projectId }
        } else {
            allReqs
        }

        if (reqs.isEmpty()) {
            return listOf(
                CoverageGlobalDto("Cobertos", 0.0, "#10b981"),
                CoverageGlobalDto("Não Cobertos", 100.0, "#ef4444")
            )
        }

        // TestCases tied to Requirements
        val testCasesWithReq = allTestCases.filter { it.requirementId != null }
        val coveredReqIds = testCasesWithReq.map { it.requirementId!! }.toSet()

        val totalReqs = reqs.size
        val coveredCount = reqs.count { coveredReqIds.contains(it.id) }
        val uncoveredCount = totalReqs - coveredCount

        val coveredPercent = (coveredCount.toDouble() / totalReqs) * 100
        val uncoveredPercent = (uncoveredCount.toDouble() / totalReqs) * 100

        return listOf(
            CoverageGlobalDto("Cobertos", "%.1f".format(Locale.US, coveredPercent).toDouble(), "#10b981"),
            CoverageGlobalDto("Não Cobertos", "%.1f".format(Locale.US, uncoveredPercent).toDouble(), "#ef4444")
        )
    }

    fun getModuleCoverage(projectId: String?): List<CoverageModuleDto> {
        val modules = moduleRepository.findAll()
        val features = featureRepository.findAll()
        val testCases = testCaseRepository.findAll()

        // A module coverage is defined by the number of features that have at least one test case vs total features
        val featureMap = features.groupBy { it.moduleId }
        
        return modules.map { mod ->
            val modFeatures = featureMap[mod.id] ?: emptyList()
            if (modFeatures.isEmpty()) {
                CoverageModuleDto(mod.name, 0.0, 100.0)
            } else {
                val coveredFeatures = modFeatures.count { feat ->
                    testCases.any { tc -> tc.featureId == feat.id }
                }
                val coverage = (coveredFeatures.toDouble() / modFeatures.size) * 100
                CoverageModuleDto(mod.name, "%.1f".format(Locale.US, coverage).toDouble(), 100.0)
            }
        }
    }

    fun getCriticalUncoveredRequirements(projectId: String?): List<UncoveredRequirementDto> {
        val allReqs = requirementRepository.findAll()
        val allTestCases = testCaseRepository.findAll()

        val reqs = if (projectId != null && projectId != "all") {
            allReqs.filter { it.projectId == projectId }
        } else {
            allReqs
        }

        val coveredReqIds = allTestCases.filter { it.requirementId != null }.groupBy { it.requirementId!! }

        return reqs.map { req ->
            val testsCount = coveredReqIds[req.id]?.size ?: 0
            // Assuming coverage is 100 if it has tests, 0 otherwise (simplified)
            val coverage = if (testsCount > 0) 100.0 else 0.0
            UncoveredRequirementDto(
                id = req.code, // using code like REQ-001
                title = req.title,
                status = req.criticality, // Alto, Medio, etc
                coverage = coverage
            )
        }.filter { it.coverage < 100.0 }
         .sortedByDescending { if (it.status.equals("CRITICAL", ignoreCase = true) || it.status.equals("Crítica", ignoreCase = true)) 2 else 1 }
         .take(10) // top 10 most critical uncovered
    }
}
