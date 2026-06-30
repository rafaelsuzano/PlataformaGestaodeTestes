package br.com.suzanoit.qa.core.domain



interface ProjectRepository {
    fun save(project: Project): Project
    fun findById(id: String): Project?
    fun findAll(): List<Project>
    fun delete(id: String)
}

interface ModuleRepository {
    fun save(module: Module): Module
    fun findById(id: String): Module?
    fun findAll(): List<Module>
    fun delete(id: String)
}

interface CategoryRepository {
    fun save(category: Category): Category
    fun findById(id: String): Category?
    fun findAll(): List<Category>
    fun delete(id: String)
}

interface RequirementRepository {
    fun save(requirement: Requirement): Requirement
    fun findById(id: String): Requirement?
    fun findAll(): List<Requirement>
    fun delete(id: String)
}

interface FeatureRepository {
    fun save(feature: Feature): Feature
    fun findById(id: String): Feature?
    fun findAll(): List<Feature>
    fun delete(id: String)
}

interface TestCaseFolderRepository {
    fun save(folder: TestCaseFolder): TestCaseFolder
    fun findById(id: String): TestCaseFolder?
    fun findByProjectId(projectId: String): List<TestCaseFolder>
    fun delete(id: String)
}

interface TestCaseRepository {
    fun save(testCase: TestCase): TestCase
    fun findById(id: String): TestCase?
    fun findAll(): List<TestCase>
    fun delete(id: String)
}

interface TestStepRepository {
    fun save(testStep: TestStep): TestStep
    fun findById(id: String): TestStep?
    fun findAll(): List<TestStep>
    fun delete(id: String)
}

interface TestExecutionRepository {
    fun save(testExecution: TestExecution): TestExecution
    fun findById(id: String): TestExecution?
    fun findAll(): List<TestExecution>
    fun delete(id: String)
}

interface TestExecutionStepRepository {
    fun save(testExecutionStep: TestExecutionStep): TestExecutionStep
    fun findById(id: String): TestExecutionStep?
    fun findAll(): List<TestExecutionStep>
    fun delete(id: String)
}

interface DefectRepository {
    fun save(defect: Defect): Defect
    fun findById(id: String): Defect?
    fun findAll(): List<Defect>
    fun delete(id: String)
}

interface TestPlanRepository {
    fun save(plan: TestPlan): TestPlan
    fun findById(id: String): TestPlan?
    fun findAll(): List<TestPlan>
    fun findByProjectId(projectId: String): List<TestPlan>
    fun delete(id: String)
}

interface EnvironmentRepository {
    fun save(environment: Environment): Environment
    fun findById(id: String): Environment?
    fun findAll(): List<Environment>
    fun delete(id: String)
}

interface ExecutionHistoryRepository {
    fun save(history: ExecutionHistory): ExecutionHistory
    fun findById(id: String): ExecutionHistory?
    fun findAll(): List<ExecutionHistory>
    fun delete(id: String)
}

interface SystemLogRepository {
    fun save(log: SystemLog): SystemLog
    fun findById(id: String): SystemLog?
    fun findAll(): List<SystemLog>
    fun delete(id: String)
}
