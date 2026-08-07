package br.com.suzanoit.qa.modules.core.application
import br.com.suzanoit.qa.modules.shared.domain.*


import br.com.suzanoit.qa.modules.core.domain.TestCaseFolder
import org.springframework.stereotype.Service

@Service
class TestCaseFolderService(private val folderRepository: TestCaseFolderRepository) {

    fun createFolder(folder: TestCaseFolder): TestCaseFolder {
        return folderRepository.save(folder)
    }

    fun updateFolder(folder: TestCaseFolder): TestCaseFolder {
        val existing = folderRepository.findById(folder.id) ?: throw IllegalArgumentException("Folder not found")
        return folderRepository.save(existing.copy(name = folder.name, parentId = folder.parentId))
    }

    fun getFoldersByProject(projectId: String): List<TestCaseFolder> {
        return folderRepository.findByProjectId(projectId)
    }

    fun deleteFolder(id: String) {
        // Todo: handle recursive deletion if necessary, or just rely on ON DELETE CASCADE in DB
        folderRepository.delete(id)
    }
}