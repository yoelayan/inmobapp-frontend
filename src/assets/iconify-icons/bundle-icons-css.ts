/**
 * This is an advanced example for creating icon bundles for Iconify SVG Framework.
 *
 * It creates a bundle from:
 * - All SVG files in a directory.
 * - Custom JSON files.
 * - Iconify icon sets.
 * - SVG framework.
 *
 * This example uses Iconify Tools to import and clean up icons.
 * For Iconify Tools documentation visit https://docs.iconify.design/tools/tools2/
 */
import path from 'path'

import { promises as fsPromises } from 'fs'

import fs from 'fs-extra'


import type { IconifyJSON } from '@iconify/tools';

import { downloadIconSet, runSVGO, parseColors } from '@iconify/tools'

import { getIconsCSS, stringToIcon } from '@iconify/utils'
import { consola } from 'consola'

const outputDirectory = path.resolve(process.cwd(), 'src/assets/iconify-icons')

// Icon sets to bundle
const iconSets = ['mdi', 'tabler', 'material-symbols', 'fa-regular', 'fa-solid', 'fa-brands', 'lucide']

async function generateCSSFile() {
  try {
    // Create directory if it doesn't exist
    await fs.ensureDir(outputDirectory)

    // Bundle all icon sets into a single CSS file
    let cssContent = '/* Generated Iconify Icons CSS */\n\n'

    for (const set of iconSets) {
      try {
        // Download icon set
        const collection = await downloadIconSet(set)

        // Optimize SVGs
        await runSVGO(collection)

        // Parse colors
        await parseColors(collection, {
          defaultColor: 'currentColor',
          callback: (attr, colorStr, _color) => {
            return colorStr === 'currentColor' ? colorStr : 'currentColor'
          }
        })

        // Generate CSS for all icons in the set
        const prefix = collection.prefix
        const icons = Object.keys(collection.icons)

        if (icons.length > 0) {
          consola.info(`Bundling ${icons.length} icons from ${prefix}`)

          for (const name of icons) {
            const iconName = `${prefix}:${name}`
            const parsed = stringToIcon(iconName)

            if (parsed) {
              const css = getIconsCSS([iconName], {
                iconifyJSONData: collection as IconifyJSON
              })

              cssContent += css + '\n'
            }
          }
        }
      } catch (err) {
        consola.error(`Error processing icon set ${set}:`, err)
      }
    }

    // Write to CSS file
    const cssFilePath = path.join(outputDirectory, 'generated-icons.css')

    await fsPromises.writeFile(cssFilePath, cssContent, 'utf8')

    // Create a dummy TS file to satisfy imports
    const tsContent = `// This file is auto-generated
// It exists to allow importing the iconify CSS
import './generated-icons.css'
export default {}
`

    await fsPromises.writeFile(path.join(outputDirectory, 'bundle-icons-css.ts'), tsContent, 'utf8')

    consola.success('Iconify icons bundled successfully!')
  } catch (error) {
    consola.error('Error generating iconify CSS:', error)
    process.exit(1)
  }
}

// Run the function
generateCSSFile()
