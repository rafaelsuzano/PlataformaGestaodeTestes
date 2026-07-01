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

    fun generatePlaywrightCode(gherkin: String): Map<String, String> {
        // Mock de Integração com LLM (OpenAI/Gemini)
        // Em um cenário real, aqui seria feita uma chamada de prompt para a IA converter Gherkin para TypeScript Playwright
        val code = """
import { test, expect } from '@playwright/test';

test.describe('Automação Gerada a partir de Gherkin', () => {
    test('Executar Cenário', async ({ page }) => {
        // Código gerado pela SuzanoIT QA AI a partir do seu Gherkin
        console.log('Iniciando o teste...');
        
        // Passos interpretados:
        // Por favor, revise os seletores e URLs abaixo antes de executar.
        
        // Given
        await test.step('Acessar o sistema', async () => {
            await page.goto('https://sua-url-aqui.com');
        });
        
        // When / And
        await test.step('Preencher dados baseados no Gherkin', async () => {
            // await page.locator('#input-id').fill('Valor');
            // await page.locator('#button-submit').click();
        });
        
        // Then
        await test.step('Validar os resultados', async () => {
            // await expect(page.locator('.success-message')).toBeVisible();
        });
    });
});
        """.trimIndent()

        return mapOf("code" to code)
    }
}
