# Open Forest Data Previewers

- [Open Forest Data Previewers](#open-forest-data-previewers)
  - [Instalacja](#instalacja)
  - [Zbudowanie aplikacji](#zbudowanie-aplikacji)
  - [Konfiguracja](#konfiguracja)
    - [TIFF Viewer](#tiff-viewer)

## Instalacja

Upewnij się że masz zainstalowanego [Node](https://nodejs.org/en/ 'Node').
  
Po pobraniu repozytorium uruchom komendę `npm install` w katalogu z aplikacją w celu zainstalowania zależności

## Zbudowanie aplikacji

`npm run build`

Kod docelowy po zbudowaniu zostanie umieszczony w katalogu `dist`

## Konfiguracja

### TIFF Viewer

Adresy potrzbne do TIFF Servera oraz TIFF Downloadera dla TIFF Viewer'a znajdują się w pliku `src/tools/tiffViewer/tiffViewer.tool.js` w zmiennych

```
const SERVER = '...' // Adres TIFF Servera;
const TIFF_UPLOADER = '...' // Adres TIFF Downloadera;
```

Po zakończeniu konfiguracji niezbędne jest zbudowanie aplikacji.
