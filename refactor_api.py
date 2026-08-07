import re
import sys

def main():
    filepath = '/Users/rafaelsuzano/Projetos/SuzanoIT/PlataformaGestaodeTestes/frontend/src/services/api.ts'
    with open(filepath, 'r') as f:
        content = f.read()

    # Adicionar import do api client se não tiver
    if "import { api }" not in content:
        content = "import { api } from './apiClient';\n" + content

    # Remover const API_URL se existir
    content = re.sub(r'const API_URL = import.meta.env.VITE_API_URL \|\| \'/api\';\n*', '', content)
    content = re.sub(r'const API_URL = import.meta.env.VITE_API_URL \|\| \'/api/v1\';\n*', '', content)

    # Função para substituir um request inteiro
    # Ex:
    # const res = await fetch(`${API_URL}/projects`);
    # if (!res.ok) throw new Error('Failed to fetch projects');
    # return res.json();
    # Para:
    # const res = await api.get('/projects');
    # return res.data;

    # O regex precisa tratar casos GET, POST, PUT, DELETE
    
    # GET Pattern:
    # const res = await fetch(`${API_URL}/route`);
    # if (!res.ok) ...
    # return res.json();
    
    get_pattern = re.compile(r'const res = await fetch\(`\$\{API_URL\}([^`]+)`\);\s*if \(!res\.ok\) throw new Error\([^)]+\);\s*return res\.json\(\);')
    content = get_pattern.sub(r"const res = await api.get(`\1`);\n    return res.data;", content)

    # DELETE Pattern:
    # const res = await fetch(`${API_URL}/route`, {
    #   method: 'DELETE'
    # });
    # if (!res.ok) throw new Error(...);
    delete_pattern = re.compile(r'const res = await fetch\(`\$\{API_URL\}([^`]+)`,\s*\{\s*method:\s*\'DELETE\'\s*\}\);\s*if \(!res\.ok\) throw new Error\([^)]+\);')
    content = delete_pattern.sub(r"await api.delete(`\1`);", content)

    # POST/PUT Pattern com JSON.stringify
    post_put_pattern = re.compile(r'const res = await fetch\(`\$\{API_URL\}([^`]+)`,\s*\{\s*method:\s*\'(POST|PUT)\',\s*headers:\s*\{\s*\'Content-Type\':\s*\'application/json\'\s*\},\s*body:\s*JSON\.stringify\(([^)]+)\)\s*\}\);\s*if \(!res\.ok\) throw new Error\([^)]+\);\s*return res\.json\(\);')
    def replace_post_put(match):
        route = match.group(1)
        method = match.group(2).lower()
        body = match.group(3)
        return f"const res = await api.{method}(`{route}`, {body});\n    return res.data;"
    content = post_put_pattern.sub(replace_post_put, content)

    # Especial caso de execução / execute plan:
    post_empty_pattern = re.compile(r'const res = await fetch\(`\$\{API_URL\}([^`]+)`,\s*\{\s*method:\s*\'POST\'\s*\}\);\s*if \(!res\.ok\) throw new Error\([^)]+\);\s*return res\.json\(\);')
    content = post_empty_pattern.sub(r"const res = await api.post(`\1`);\n    return res.data;", content)

    # Salvar
    with open(filepath, 'w') as f:
        f.write(content)
    
    print("Substituição inicial executada.")

if __name__ == '__main__':
    main()
