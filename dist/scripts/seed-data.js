"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const parser_service_1 = require("../parser/parser.service");
const path = require("path");
async function seedData() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const parserService = app.get(parser_service_1.ParserService);
    try {
        console.log('Starting data seeding...');
        const jsonPath = path.join(process.cwd(), 'cgi_2025.json');
        try {
            await parserService.parseCgiJsonFile(jsonPath);
            console.log('Successfully parsed cgi_2025.json');
        }
        catch (jsonError) {
            console.log('cgi_2025.json not found or invalid, trying text sources...');
            let cgiFilePath = path.join(process.cwd(), 'cgi-2025-fr-brut.txt');
            try {
                await parserService.parseCgiFile(cgiFilePath);
                console.log('Successfully parsed cgi-2025-fr-brut.txt');
            }
            catch (error) {
                console.log('cgi-2025-fr-brut.txt not found, trying CGI-2025-FR.txt...');
                cgiFilePath = path.join(process.cwd(), 'CGI-2025-FR.txt');
                await parserService.parseCgiFile(cgiFilePath);
                console.log('Successfully parsed CGI-2025-FR.txt');
            }
        }
        console.log('Data seeding completed successfully!');
    }
    catch (error) {
        console.error('Error during data seeding:', error);
    }
    finally {
        await app.close();
    }
}
seedData();
//# sourceMappingURL=seed-data.js.map