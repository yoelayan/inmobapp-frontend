#!/usr/bin/env node

/**
 * Script para generar tests automáticamente usando los templates
 *
 * Uso:
 * node generate-test.js <tipo> <entidad> [opciones]
 *
 * Tipos disponibles: list, form, view
 *
 * Ejemplos:
 * node generate-test.js list propiedades
 * node generate-test.js form clientes --action=add
 * node generate-test.js view usuarios
 */

const fs = require('fs')
const path = require('path')

// Configuración por defecto
const config = {
  templatesDir: path.join(__dirname, 'templates'),
  outputDir: path.join(__dirname, '../../app/(dashboard)'),
  templates: {
    list: 'list-page.template.tsx',
    form: 'form-page.template.tsx',
    view: 'view-page.template.tsx'
  }
}

// Mapeo de entidades comunes
const entityConfig = {
  usuarios: {
    name: 'Usuario',
    lower: 'usuario',
    plural: 'Usuarios',
    pluralLower: 'usuarios',
    tableTestId: 'mock-users-table',
    formTestId: 'mock-userform',
    expectedHeaders: [
      "expect(screen.getByText('Nombre')).toBeInTheDocument()",
      "expect(screen.getByText('Email')).toBeInTheDocument()",
      "expect(screen.getByText('Acciones')).toBeInTheDocument()"
    ],
    expectedData: [
      "expect(screen.getByText('Test User')).toBeInTheDocument()",
      "expect(screen.getByText('test@example.com')).toBeInTheDocument()"
    ],
    loadingText: 'cargando datos del usuario',
    errorMessage: 'error al cargar los datos del usuario'
  },
  franquicias: {
    name: 'Franquicia',
    lower: 'franquicia',
    plural: 'Franquicias',
    pluralLower: 'franquicias',
    tableTestId: 'mock-franchises-table',
    formTestId: 'mock-franchiseform',
    expectedHeaders: [
      "expect(screen.getByText('Nombre')).toBeInTheDocument()",
      "expect(screen.getByText('Tipo')).toBeInTheDocument()",
      "expect(screen.getByText('Acciones')).toBeInTheDocument()"
    ],
    expectedData: [
      "expect(screen.getByText('Test Franchise')).toBeInTheDocument()",
      "expect(screen.getByText('Commercial')).toBeInTheDocument()"
    ],
    loadingText: 'cargando datos de la franquicia',
    errorMessage: 'error al cargar los datos de la franquicia'
  },
  clientes: {
    name: 'Cliente',
    lower: 'cliente',
    plural: 'Clientes',
    pluralLower: 'clientes',
    tableTestId: 'mock-clients-table',
    formTestId: 'mock-clientform',
    expectedHeaders: [
      "expect(screen.getByText('Nombre')).toBeInTheDocument()",
      "expect(screen.getByText('Email')).toBeInTheDocument()",
      "expect(screen.getByText('Acciones')).toBeInTheDocument()"
    ],
    expectedData: [
      "expect(screen.getByText('Test Client')).toBeInTheDocument()",
      "expect(screen.getByText('client@example.com')).toBeInTheDocument()"
    ],
    loadingText: 'cargando datos del cliente',
    errorMessage: 'error al cargar los datos del cliente'
  },
  propiedades: {
    name: 'Propiedad',
    lower: 'propiedad',
    plural: 'Propiedades',
    pluralLower: 'propiedades',
    tableTestId: 'mock-properties-table',
    formTestId: 'mock-propertyform',
    expectedHeaders: [
      "expect(screen.getByText('Título')).toBeInTheDocument()",
      "expect(screen.getByText('Precio')).toBeInTheDocument()",
      "expect(screen.getByText('Estado')).toBeInTheDocument()"
    ],
    expectedData: [
      "expect(screen.getByText('Casa de Prueba')).toBeInTheDocument()",
      "expect(screen.getByText('$150,000')).toBeInTheDocument()"
    ],
    loadingText: 'cargando datos de la propiedad',
    errorMessage: 'error al cargar los datos de la propiedad'
  }
}

// Función para procesar argumentos
function parseArgs() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.error('Uso: node generate-test.js <tipo> <entidad> [opciones]')
    console.error('Tipos: list, form, view')
    console.error('Entidades disponibles:', Object.keys(entityConfig).join(', '))
    process.exit(1)
  }

  const [type, entity] = args
  const options = {}

  // Procesar opciones adicionales
  args.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=')
      options[key] = value || true
    }
  })

  return { type, entity, options }
}

// Función para capitalizar
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Función para generar el test
function generateTest(type, entity, options = {}) {
  // Validar tipo
  if (!config.templates[type]) {
    console.error(`Tipo '${type}' no válido. Tipos disponibles: ${Object.keys(config.templates).join(', ')}`)
    return false
  }

  // Obtener configuración de la entidad
  const entityConf = entityConfig[entity]
  if (!entityConf) {
    console.error(`Entidad '${entity}' no configurada. Entidades disponibles: ${Object.keys(entityConfig).join(', ')}`)
    return false
  }

  // Leer template
  const templatePath = path.join(config.templatesDir, config.templates[type])
  if (!fs.existsSync(templatePath)) {
    console.error(`Template no encontrado: ${templatePath}`)
    return false
  }

  let template = fs.readFileSync(templatePath, 'utf8')

  // Configurar acción para formularios
  const action = options.action === 'edit' ? 'Edit' : 'Add'
  const actionLower = action.toLowerCase()

  // Reemplazos comunes
  const replacements = {
    '{{ENTITY_NAME}}': entityConf.name,
    '{{ENTITY_LOWER}}': entityConf.lower,
    '{{ENTITY_PLURAL}}': entityConf.plural,
    '{{ENTITY_PLURAL_LOWER}}': entityConf.pluralLower,
    '{{TABLE_TESTID}}': entityConf.tableTestId,
    '{{FORM_TESTID}}': entityConf.formTestId,
    '{{EXPECTED_TITLE}}': entityConf.plural,
    '{{ADD_BUTTON_TEXT}}': `Agregar ${entityConf.name}`,
    '{{EXPECTED_HEADERS}}': entityConf.expectedHeaders.join('\n    '),
    '{{EXPECTED_DATA}}': entityConf.expectedData.join('\n      '),
    '{{LOADING_TEXT}}': entityConf.loadingText,
    '{{ERROR_MESSAGE}}': entityConf.errorMessage,
    '{{ACTION}}': action,
    '{{ACTION_LOWER}}': actionLower,
    '{{ENTITY_DATA}}': entityConf.expectedData.join('\n      '),
    '{{ENTITY_FIELDS}}': `it('should display ${entityConf.lower} fields', async () => {
      render(<View${entityConf.name}Page params={mockParams} />)
      await waitFor(() => {
        expect(screen.getByTestId('mock-card')).toBeInTheDocument()
      })
    })`
  }

  // Aplicar reemplazos
  Object.entries(replacements).forEach(([placeholder, value]) => {
    template = template.replace(new RegExp(placeholder, 'g'), value)
  })

  // Determinar directorio de salida
  let outputDir
  switch (type) {
    case 'list':
      outputDir = path.join(config.outputDir, entity, '__tests__')
      break
    case 'form':
      const formAction = actionLower === 'edit' ? '[id]/editar' : 'agregar'
      outputDir = path.join(config.outputDir, entity, formAction, '__tests__')
      break
    case 'view':
      outputDir = path.join(config.outputDir, entity, '[id]', 'ver', '__tests__')
      break
  }

  // Crear directorio si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Escribir archivo
  const outputFile = path.join(outputDir, 'page.test.tsx')
  fs.writeFileSync(outputFile, template)

  console.log(`✅ Test generado exitosamente: ${outputFile}`)

  // Mostrar próximos pasos
  console.log('\n📋 Próximos pasos:')
  console.log('1. Revisar el test generado')
  console.log('2. Ajustar assertions específicas si es necesario')
  console.log('3. Ejecutar el test: npm test')

  return true
}

// Función principal
function main() {
  const { type, entity, options } = parseArgs()

  console.log(`🔨 Generando test ${type} para ${entity}...`)

  const success = generateTest(type, entity, options)

  if (success) {
    console.log('\n🎉 ¡Test generado exitosamente!')
  } else {
    process.exit(1)
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main()
}

module.exports = { generateTest, entityConfig }
