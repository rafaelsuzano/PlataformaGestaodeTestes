package br.com.suzanoit.qa.core.domain

data class KpiMetricsDto(
    val passRate: Double,
    val defectsPerKloc: Double,
    val testVelocity: Int,
    val totalBugs: Int
)

data class TrendDataDto(
    val name: String,
    val pass: Int,
    val fail: Int,
    val bugs: Int
)

data class DefectDensityDto(
    val name: String,
    val density: Double
)

data class CoverageGlobalDto(
    val name: String,
    val value: Double,
    val color: String
)

data class CoverageModuleDto(
    val name: String,
    val coberto: Double,
    val total: Double
)

data class UncoveredRequirementDto(
    val id: String,
    val title: String,
    val status: String,
    val coverage: Double
)
