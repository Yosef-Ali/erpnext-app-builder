const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');
const logger = require('../utils/logger');

class AppGenerator {
  constructor() {
    this.templatesPath = path.join(__dirname, '../../templates');
  }

  async generateFromPRD(prdContent, appConfig, workDir) {
    try {
      logger.info(`Generating app from PRD: ${appConfig.name}`);

      // Create app directory
      const appPath = path.join(workDir, appConfig.name);
      await fs.ensureDir(appPath);

      // Parse PRD and extract requirements
      const requirements = await this.parsePRD(prdContent);
      
      // Generate app structure
      await this.createAppStructure(appPath, appConfig, requirements);
      
      // Generate DocTypes
      await this.generateDocTypes(appPath, requirements.docTypes || []);
      
      // Generate Pages
      await this.generatePages(appPath, requirements.pages || []);
      
      // Generate Reports
      await this.generateReports(appPath, requirements.reports || []);
      
      // Generate Web Forms
      await this.generateWebForms(appPath, requirements.webForms || []);
      
      // Generate Workflows
      await this.generateWorkflows(appPath, requirements.workflows || []);

      // Generate fixtures and demo data
      await this.generateFixtures(appPath, requirements.fixtures || []);

      logger.info(`App generation completed: ${appConfig.name}`);
      return appPath;

    } catch (error) {
      logger.error(`App generation failed: ${appConfig.name}`, error);
      throw error;
    }
  }

  async parsePRD(prdContent) {
    // Enhanced PRD parsing logic
    const requirements = {
      docTypes: [],
      pages: [],
      reports: [],
      webForms: [],
      workflows: [],
      fixtures: []
    };

    // Use AI or rule-based parsing to extract structured data from PRD
    // This would integrate with your existing PRD processor
    
    // Example parsing (you'd replace with your actual PRD analysis)
    const lines = prdContent.split('\n');
    let currentSection = null;
    let currentItem = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Detect section headers
      if (trimmedLine.match(/^#{1,3}\s*(DocType|Entity|Model)/i)) {
        currentSection = 'docTypes';
        currentItem = { name: '', fields: [], permissions: [] };
      } else if (trimmedLine.match(/^#{1,3}\s*(Page|Screen|View)/i)) {
        currentSection = 'pages';
        currentItem = { name: '', route: '', content: '' };
      } else if (trimmedLine.match(/^#{1,3}\s*(Report|Analytics)/i)) {
        currentSection = 'reports';
        currentItem = { name: '', type: 'Query Report', query: '' };
      }
      
      // Extract names and details
      if (currentSection && currentItem) {
        if (trimmedLine.match(/^#{1,3}\s/)) {
          // New item
          if (currentItem.name) {
            requirements[currentSection].push(currentItem);
          }
          currentItem.name = trimmedLine.replace(/^#{1,3}\s*/, '').split(':')[0].trim();
        } else if (trimmedLine.includes('Field:') || trimmedLine.includes('Column:')) {
          // Field definition
          const fieldMatch = trimmedLine.match(/Field:\s*(.+)/i);
          if (fieldMatch && currentSection === 'docTypes') {
            currentItem.fields.push(this.parseFieldDefinition(fieldMatch[1]));
          }
        }
      }
    }

    // Add the last item
    if (currentSection && currentItem && currentItem.name) {
      requirements[currentSection].push(currentItem);
    }

    return requirements;
  }

  parseFieldDefinition(fieldText) {
    // Parse field definitions like "Name (Data, Required)" or "Amount (Currency)"
    const match = fieldText.match(/^(.+?)\s*\(([^)]+)\)/);
    if (match) {
      const [, label, options] = match;
      const optionsList = options.split(',').map(o => o.trim());
      
      return {
        fieldname: label.toLowerCase().replace(/\s+/g, '_'),
        label: label.trim(),
        fieldtype: this.mapFieldType(optionsList[0]),
        reqd: optionsList.includes('Required') ? 1 : 0,
        options: optionsList.includes('Link') ? optionsList[1] : null
      };
    }
    
    return {
      fieldname: fieldText.toLowerCase().replace(/\s+/g, '_'),
      label: fieldText,
      fieldtype: 'Data'
    };
  }

  mapFieldType(type) {
    const typeMap = {
      'Text': 'Data',
      'Number': 'Int',
      'Decimal': 'Float',
      'Date': 'Date',
      'DateTime': 'Datetime',
      'Currency': 'Currency',
      'Link': 'Link',
      'Select': 'Select',
      'Check': 'Check',
      'Table': 'Table'
    };
    
    return typeMap[type] || 'Data';
  }

  async createAppStructure(appPath, appConfig, requirements) {
    // Create basic Frappe app structure
    const directories = [
      `${appConfig.name}`,
      `${appConfig.name}/config`,
      `${appConfig.name}/fixtures`,
      `${appConfig.name}/public`,
      `${appConfig.name}/public/css`,
      `${appConfig.name}/public/js`,
      `${appConfig.name}/templates`,
      `${appConfig.name}/www`
    ];

    for (const dir of directories) {
      await fs.ensureDir(path.join(appPath, dir));
    }

    // Create __init__.py files
    const initPaths = [
      `${appConfig.name}/__init__.py`,
      `${appConfig.name}/config/__init__.py`
    ];

    for (const initPath of initPaths) {
      await fs.writeFile(path.join(appPath, initPath), '__version__ = "0.0.1"\n');
    }

    // Create hooks.py
    await this.createHooksFile(appPath, appConfig);
    
    // Create modules.txt
    await this.createModulesFile(appPath, appConfig, requirements);
    
    // Create setup.py
    await this.createSetupFile(appPath, appConfig);
    
    // Create manifest.json
    await this.createManifestFile(appPath, appConfig);

    // Create requirements.txt
    await fs.writeFile(path.join(appPath, 'requirements.txt'), 'frappe>=13.0.0\n');

    // Create README.md
    await this.createReadmeFile(appPath, appConfig);
  }

  async createHooksFile(appPath, appConfig) {
    const hooksContent = `# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "${appConfig.name}"
app_title = "${appConfig.title || appConfig.name}"
app_publisher = "${appConfig.publisher || 'Your Company'}"
app_description = "${appConfig.description || 'Generated ERPNext App'}"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "${appConfig.email || 'admin@example.com'}"
app_license = "${appConfig.license || 'MIT'}"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/${appConfig.name}/css/app.css"
# app_include_js = "/assets/${appConfig.name}/js/app.js"

# include js, css files in header of web template
# web_include_css = "/assets/${appConfig.name}/css/web.css"
# web_include_js = "/assets/${appConfig.name}/js/web.js"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "${appConfig.name}.install.before_install"
# after_install = "${appConfig.name}.install.after_install"

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"${appConfig.name}.tasks.all"
# 	],
# 	"daily": [
# 		"${appConfig.name}.tasks.daily"
# 	],
# 	"hourly": [
# 		"${appConfig.name}.tasks.hourly"
# 	],
# 	"weekly": [
# 		"${appConfig.name}.tasks.weekly"
# 	]
# 	"monthly": [
# 		"${appConfig.name}.tasks.monthly"
# 	]
# }
`;

    await fs.writeFile(path.join(appPath, `${appConfig.name}/hooks.py`), hooksContent);
  }

  async createModulesFile(appPath, appConfig, requirements) {
    const modules = new Set(['Core']);
    
    // Add modules based on requirements
    requirements.docTypes.forEach(docType => {
      modules.add(docType.module || 'Core');
    });

    const modulesContent = Array.from(modules).join('\n');
    await fs.writeFile(path.join(appPath, `${appConfig.name}/modules.txt`), modulesContent);
  }

  async createSetupFile(appPath, appConfig) {
    const setupContent = `# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\\n")

# get version from __version__ variable in ${appConfig.name}/__init__.py
from ${appConfig.name} import __version__ as version

setup(
	name="${appConfig.name}",
	version=version,
	description="${appConfig.description || 'Generated ERPNext App'}",
	author="${appConfig.publisher || 'Your Company'}",
	author_email="${appConfig.email || 'admin@example.com'}",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
`;

    await fs.writeFile(path.join(appPath, 'setup.py'), setupContent);
  }

  async createManifestFile(appPath, appConfig) {
    const manifestContent = `include MANIFEST.in
include requirements.txt
include *.json
include *.md
include *.py
include *.txt
recursive-include ${appConfig.name} *.css
recursive-include ${appConfig.name} *.csv
recursive-include ${appConfig.name} *.html
recursive-include ${appConfig.name} *.ico
recursive-include ${appConfig.name} *.js
recursive-include ${appConfig.name} *.json
recursive-include ${appConfig.name} *.md
recursive-include ${appConfig.name} *.png
recursive-include ${appConfig.name} *.py
recursive-include ${appConfig.name} *.svg
recursive-include ${appConfig.name} *.txt
recursive-exclude ${appConfig.name} *.pyc`;

    await fs.writeFile(path.join(appPath, 'MANIFEST.in'), manifestContent);
  }

  async createReadmeFile(appPath, appConfig) {
    const readmeContent = `## ${appConfig.title || appConfig.name}

${appConfig.description || 'Generated ERPNext App'}

#### License

${appConfig.license || 'MIT'}`;

    await fs.writeFile(path.join(appPath, 'README.md'), readmeContent);
  }

  async generateDocTypes(appPath, docTypes) {
    for (const docType of docTypes) {
      await this.generateSingleDocType(appPath, docType);
    }
  }

  async generateSingleDocType(appPath, docType) {
    const module = docType.module || 'core';
    const docTypePath = path.join(appPath, `${path.basename(appPath)}/doctype/${docType.name.toLowerCase().replace(/\s+/g, '_')}`);
    
    await fs.ensureDir(docTypePath);

    // Create DocType JSON
    const docTypeJson = {
      "creation": new Date().toISOString(),
      "doctype": "DocType",
      "editable_grid": 1,
      "engine": "InnoDB",
      "field_order": docType.fields.map(f => f.fieldname),
      "fields": docType.fields.map((field, idx) => ({
        "fieldname": field.fieldname,
        "fieldtype": field.fieldtype,
        "idx": idx + 1,
        "label": field.label,
        "reqd": field.reqd || 0,
        "options": field.options || ""
      })),
      "idx": 0,
      "istable": 0,
      "modified": new Date().toISOString(),
      "modified_by": "Administrator",
      "module": module,
      "name": docType.name,
      "owner": "Administrator",
      "permissions": [
        {
          "create": 1,
          "delete": 1,
          "email": 1,
          "export": 1,
          "print": 1,
          "read": 1,
          "report": 1,
          "role": "System Manager",
          "share": 1,
          "write": 1
        }
      ],
      "quick_entry": 1,
      "sort_field": "modified",
      "sort_order": "DESC",
      "track_changes": 1
    };

    await fs.writeFile(
      path.join(docTypePath, `${docType.name.toLowerCase().replace(/\s+/g, '_')}.json`),
      JSON.stringify(docTypeJson, null, 1)
    );

    // Create DocType Python file
    const pythonContent = `# -*- coding: utf-8 -*-
# Copyright (c) ${new Date().getFullYear()}, ${docType.publisher || 'Your Company'} and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ${docType.name.replace(/\s+/g, '')}(Document):
	pass
`;

    await fs.writeFile(
      path.join(docTypePath, `${docType.name.toLowerCase().replace(/\s+/g, '_')}.py`),
      pythonContent
    );

    // Create __init__.py
    await fs.writeFile(path.join(docTypePath, '__init__.py'), '');

    // Create test file
    const testContent = `# -*- coding: utf-8 -*-
# Copyright (c) ${new Date().getFullYear()}, ${docType.publisher || 'Your Company'} and Contributors
# See license.txt
from __future__ import unicode_literals

import frappe
import unittest

class Test${docType.name.replace(/\s+/g, '')}(unittest.TestCase):
	pass
`;

    await fs.writeFile(
      path.join(docTypePath, `test_${docType.name.toLowerCase().replace(/\s+/g, '_')}.py`),
      testContent
    );
  }

  async generatePages(appPath, pages) {
    for (const page of pages) {
      await this.generateSinglePage(appPath, page);
    }
  }

  async generateSinglePage(appPath, page) {
    const pagePath = path.join(appPath, `${path.basename(appPath)}/www/${page.route || page.name.toLowerCase().replace(/\s+/g, '_')}`);
    await fs.ensureDir(pagePath);

    // Create page HTML
    const htmlContent = `<div class="container">
    <div class="row">
        <div class="col-md-12">
            <h1>${page.name}</h1>
            <p>${page.description || 'Page description goes here.'}</p>
            ${page.content || '<!-- Page content goes here -->'}
        </div>
    </div>
</div>`;

    await fs.writeFile(path.join(pagePath, 'index.html'), htmlContent);

    // Create page Python controller (if needed)
    if (page.hasController) {
      const pythonContent = `import frappe

def get_context(context):
    # Page context goes here
    context.title = "${page.name}"
    return context
`;

      await fs.writeFile(path.join(pagePath, 'index.py'), pythonContent);
    }
  }

  async generateReports(appPath, reports) {
    for (const report of reports) {
      await this.generateSingleReport(appPath, report);
    }
  }

  async generateSingleReport(appPath, report) {
    const reportPath = path.join(appPath, `${path.basename(appPath)}/report/${report.name.toLowerCase().replace(/\s+/g, '_')}`);
    await fs.ensureDir(reportPath);

    // Create Report JSON
    const reportJson = {
      "creation": new Date().toISOString(),
      "doctype": "Report",
      "idx": 0,
      "is_standard": "Yes",
      "modified": new Date().toISOString(),
      "modified_by": "Administrator",
      "module": "Core",
      "name": report.name,
      "owner": "Administrator",
      "ref_doctype": report.refDoctype || "DocType",
      "report_name": report.name,
      "report_type": report.type || "Query Report"
    };

    await fs.writeFile(
      path.join(reportPath, `${report.name.toLowerCase().replace(/\s+/g, '_')}.json`),
      JSON.stringify(reportJson, null, 1)
    );

    // Create Report Python file
    const pythonContent = `# Copyright (c) ${new Date().getFullYear()}, ${report.publisher || 'Your Company'} and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
	columns, data = [], []
	
	columns = [
		{
			"label": "ID",
			"fieldname": "name",
			"fieldtype": "Link",
			"options": "${report.refDoctype || 'DocType'}",
			"width": 200
		}
	]
	
	data = frappe.get_all("${report.refDoctype || 'DocType'}", 
		fields=["name"], 
		filters=filters or {}
	)
	
	return columns, data
`;

    await fs.writeFile(
      path.join(reportPath, `${report.name.toLowerCase().replace(/\s+/g, '_')}.py`),
      pythonContent
    );
  }

  async generateWebForms(appPath, webForms) {
    for (const webForm of webForms) {
      await this.generateSingleWebForm(appPath, webForm);
    }
  }

  async generateSingleWebForm(appPath, webForm) {
    // Web forms are typically created through Frappe UI
    // Here we create the basic structure
    const webFormJson = {
      "creation": new Date().toISOString(),
      "doctype": "Web Form",
      "doc_type": webForm.docType || "DocType",
      "idx": 0,
      "is_standard": 1,
      "modified": new Date().toISOString(),
      "modified_by": "Administrator",
      "module": "Core",
      "name": webForm.name,
      "owner": "Administrator",
      "published": 1,
      "route": webForm.route || webForm.name.toLowerCase().replace(/\s+/g, '-'),
      "title": webForm.title || webForm.name,
      "web_form_fields": webForm.fields || []
    };

    const webFormPath = path.join(appPath, `${path.basename(appPath)}/fixtures`);
    await fs.ensureDir(webFormPath);
    
    await fs.writeFile(
      path.join(webFormPath, `${webForm.name.toLowerCase().replace(/\s+/g, '_')}_web_form.json`),
      JSON.stringify([webFormJson], null, 1)
    );
  }

  async generateWorkflows(appPath, workflows) {
    for (const workflow of workflows) {
      await this.generateSingleWorkflow(appPath, workflow);
    }
  }

  async generateSingleWorkflow(appPath, workflow) {
    const workflowJson = {
      "creation": new Date().toISOString(),
      "doctype": "Workflow",
      "document_type": workflow.docType || "DocType",
      "idx": 0,
      "is_active": 1,
      "modified": new Date().toISOString(),
      "modified_by": "Administrator",
      "name": workflow.name,
      "owner": "Administrator",
      "workflow_name": workflow.name,
      "states": workflow.states || [],
      "transitions": workflow.transitions || []
    };

    const workflowPath = path.join(appPath, `${path.basename(appPath)}/fixtures`);
    await fs.ensureDir(workflowPath);
    
    await fs.writeFile(
      path.join(workflowPath, `${workflow.name.toLowerCase().replace(/\s+/g, '_')}_workflow.json`),
      JSON.stringify([workflowJson], null, 1)
    );
  }

  async generateFixtures(appPath, fixtures) {
    if (fixtures.length === 0) return;

    const fixturesPath = path.join(appPath, `${path.basename(appPath)}/fixtures`);
    await fs.ensureDir(fixturesPath);

    for (const fixture of fixtures) {
      await fs.writeFile(
        path.join(fixturesPath, `${fixture.name}.json`),
        JSON.stringify(fixture.data, null, 1)
      );
    }
  }

  async setupApp(appPath) {
    try {
      // Validate app structure
      await this.validateAppStructure(appPath);
      
      // Install dependencies (if bench is available)
      if (await this.isBenchAvailable()) {
        logger.info('Installing app dependencies...');
        execSync('pip install -e .', { cwd: appPath, stdio: 'inherit' });
      }
      
      logger.info('App setup completed');
    } catch (error) {
      logger.error('App setup failed:', error);
      throw error;
    }
  }

  async validateAppStructure(appPath) {
    const requiredFiles = [
      'setup.py',
      'MANIFEST.in',
      'requirements.txt'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(appPath, file);
      if (!await fs.pathExists(filePath)) {
        throw new Error(`Required file missing: ${file}`);
      }
    }
  }

  async isBenchAvailable() {
    try {
      execSync('which bench', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  async packageApp(appPath, appName) {
    const packagePath = path.join(path.dirname(appPath), `${appName}.tar.gz`);
    
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(packagePath);
      const archive = archiver('tar', { gzip: true });

      output.on('close', () => {
        logger.info(`App packaged: ${packagePath} (${archive.pointer()} bytes)`);
        resolve(packagePath);
      });

      archive.on('error', reject);
      archive.pipe(output);
      archive.directory(appPath, appName);
      archive.finalize();
    });
  }
}

module.exports = AppGenerator;