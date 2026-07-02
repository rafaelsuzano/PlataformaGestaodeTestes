package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.*
import org.springframework.stereotype.Service
import java.time.format.DateTimeFormatter
import java.time.temporal.WeekFields
import java.util.Locale

@Service
class MetricsService(
    private val testExecutionRepository: TestExecutionRepository,
    private val defectRepository: DefectRepository,
    private val moduleRepository: ModuleRepository,
    private val featureRepository: FeatureRepository,
    private val testCaseRepository: TestCaseRepository
) {

    fun getKpis(projectId: String?): KpiMetricsDto {
        val allExecutions = testExecutionRepository.findAll()
        val allDefects = defectRepository.findAll()
        
        val executions = if (projectId != null && projectId != "all") {
            // Note: In a real scenario we would filter executions by project
            // For MVP, if projectId is passed, we would need to join with test plan/test case to filter.
            // Simplified for now: just return all if all, or filter if we can.
            allExecutions
        } else {
            allExecutions
        }

        val defects = if (projectId != null && projectId != "all") {
            allDefects
        } else {
            allDefects
        }

        val totalExecuted = executions.size
        val passedExecutions = executions.count { it.status == "PASSED" }
        val passRate = if (totalExecuted > 0) (passedExecutions.toDouble() / totalExecuted) * 100 else 0.0

        val totalBugs = defects.size
        
        // Simulating KLOC or just defects per 1000 test executions
        val kloc = if (totalExecuted > 0) totalExecuted / 1000.0 else 1.0
        val defectsPerKloc = if (kloc > 0) totalBugs / kloc else 0.0

        // Velocity: Average test executions per day in the last 30 days (mocking the days for now based on count)
        val velocity = if (totalExecuted > 0) totalExecuted / 30 else 0

        return KpiMetricsDto(
            passRate = "%.1f".format(Locale.US, passRate).toDouble(),
            defectsPerKloc = "%.2f".format(Locale.US, defectsPerKloc).toDouble(),
            testVelocity = velocity,
            totalBugs = totalBugs
        )
    }

    fun getTrend(projectId: String?): List<TrendDataDto> {
        val allExecutions = testExecutionRepository.findAll()
        val allDefects = defectRepository.findAll()
        
        val weekFields = WeekFields.of(Locale.getDefault())

        val trendMap = mutableMapOf<Int, TrendDataDto>()

        // Group executions by week
        allExecutions.filter { it.startedAt != null }.forEach { exec ->
            val week = exec.startedAt!!.get(weekFields.weekOfWeekBasedYear())
            val current = trendMap.getOrDefault(week, TrendDataDto("Sem \$week", 0, 0, 0))
            
            trendMap[week] = current.copy(
                pass = current.pass + if (exec.status == "PASSED") 1 else 0,
                fail = current.fail + if (exec.status == "FAILED") 1 else 0
            )
        }

        // Add defects by week
        allDefects.forEach { defect ->
            val week = defect.createdAt.get(weekFields.weekOfWeekBasedYear())
            val current = trendMap.getOrDefault(week, TrendDataDto("Sem \$week", 0, 0, 0))
            trendMap[week] = current.copy(bugs = current.bugs + 1)
        }

        // If no data, return mock structure but zeroed so the chart doesn't break
        if (trendMap.isEmpty()) {
            return (1..4).map { TrendDataDto("Sem \$it", 0, 0, 0) }
        }

        return trendMap.entries.sortedBy { it.key }.map { it.value }
    }

    fun getDefectDensity(projectId: String?): List<DefectDensityDto> {
        val modules = moduleRepository.findAll()
        val features = featureRepository.findAll()
        val testCases = testCaseRepository.findAll()
        val defects = defectRepository.findAll()

        // Map Defect -> TestCase -> Feature -> Module
        val testCaseMap = testCases.associateBy { it.id }
        val featureMap = features.associateBy { it.id }
        
        val defectCountsByModule = mutableMapOf<String, Int>()

        defects.forEach { defect ->
            val tc = testCaseMap[defect.testCaseId]
            if (tc != null && tc.featureId != null) {
                val feature = featureMap[tc.featureId]
                if (feature != null) {
                    val count = defectCountsByModule.getOrDefault(feature.moduleId, 0)
                    defectCountsByModule[feature.moduleId] = count + 1
                }
            }
        }

        return modules.map { mod ->
            val defectsInModule = defectCountsByModule[mod.id] ?: 0
            // Simulated KLOC per module = 1.0 (to show density as defects per KLOC equivalent)
            DefectDensityDto(
                name = mod.name,
                density = "%.2f".format(Locale.US, defectsInModule / 1.0).toDouble()
            )
        }
    }
}
