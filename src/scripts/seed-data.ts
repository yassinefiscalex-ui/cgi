import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ParserService } from '../parser/parser.service';
import * as path from 'path';

async function seedData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const parserService = app.get(ParserService);

  try {
    console.log('Starting data seeding...');
    
    // Prefer JSON if available, then fallback to text files
    const jsonPath = path.join(process.cwd(), 'cgi_2025.json');
    try {
      await parserService.parseCgiJsonFile(jsonPath);
      console.log('Successfully parsed cgi_2025.json');
    } catch (jsonError) {
      console.log('cgi_2025.json not found or invalid, trying text sources...');

      // Try to use the brut file first, fallback to the regular file
      let cgiFilePath = path.join(process.cwd(), 'cgi-2025-fr-brut.txt');
      try {
        await parserService.parseCgiFile(cgiFilePath);
        console.log('Successfully parsed cgi-2025-fr-brut.txt');
      } catch (error) {
        console.log('cgi-2025-fr-brut.txt not found, trying CGI-2025-FR.txt...');
        cgiFilePath = path.join(process.cwd(), 'CGI-2025-FR.txt');
        await parserService.parseCgiFile(cgiFilePath);
        console.log('Successfully parsed CGI-2025-FR.txt');
      }
    }
    
    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error during data seeding:', error);
  } finally {
    await app.close();
  }
}

seedData();