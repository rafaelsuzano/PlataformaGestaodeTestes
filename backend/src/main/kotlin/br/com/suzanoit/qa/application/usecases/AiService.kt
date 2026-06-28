package br.com.suzanoit.qa.application.usecases

import org.springframework.stereotype.Service

@Service
class AiService {

    fun generateBdd(context: String): Map<String, String> {
        // Mock de Integração com LLM (OpenAI/Gemini)
        // Em um ambiente real, faria um request POST para a API do modelo passando o 'context'
        
        val preConditions = "1. O usuário deve estar autenticado na plataforma.\n2. O sistema deve estar online e respondendo na URL base."
        val steps = "Dado que o usuário acessa o sistema\nQuando ele preenche o formulário com dados válidos baseados no contexto: '$context'\nE clica em salvar\nEntão o sistema deve processar a requisição com sucesso"
        val expectedResult = "O sistema deve exibir a mensagem de sucesso e o registro deve constar no banco de dados."

        return mapOf(
            "preConditions" to preConditions,
            "steps" to steps,
            "expectedResult" to expectedResult
        )
    }
}
