package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.MetricsService
import br.com.suzanoit.qa.application.usecases.CoverageService
import br.com.suzanoit.qa.core.domain.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/metrics")
class MetricsController(
    private val metricsService: MetricsService
) {

    @GetMapping("/kpis")
    fun getKpis(@RequestParam(required = false) projectId: String?): ResponseEntity<KpiMetricsDto> {
        return ResponseEntity.ok(metricsService.getKpis(projectId))
    }

    @GetMapping("/trend")
    fun getTrend(@RequestParam(required = false) projectId: String?): ResponseEntity<List<TrendDataDto>> {
        return ResponseEntity.ok(metricsService.getTrend(projectId))
    }

    @GetMapping("/defects/density")
    fun getDefectDensity(@RequestParam(required = false) projectId: String?): ResponseEntity<List<DefectDensityDto>> {
        return ResponseEntity.ok(metricsService.getDefectDensity(projectId))
    }
}

@RestController
@RequestMapping("/api/coverage")
class CoverageController(
    private val coverageService: CoverageService
) {

    @GetMapping("/global")
    fun getGlobalCoverage(@RequestParam(required = false) projectId: String?): ResponseEntity<List<CoverageGlobalDto>> {
        return ResponseEntity.ok(coverageService.getGlobalCoverage(projectId))
    }

    @GetMapping("/modules")
    fun getModuleCoverage(@RequestParam(required = false) projectId: String?): ResponseEntity<List<CoverageModuleDto>> {
        return ResponseEntity.ok(coverageService.getModuleCoverage(projectId))
    }

    @GetMapping("/requirements/uncovered")
    fun getCriticalUncoveredRequirements(@RequestParam(required = false) projectId: String?): ResponseEntity<List<UncoveredRequirementDto>> {
        return ResponseEntity.ok(coverageService.getCriticalUncoveredRequirements(projectId))
    }
}
