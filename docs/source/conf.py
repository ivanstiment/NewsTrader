# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- PATH setup --------------------------------------------------------------
import os
import sys
# Añadir la ruta raíz del proyecto (un nivel arriba de /docs)
sys.path.insert(0, os.path.abspath('../..'))

# -- Django setup for Sphinx autodoc ----------------------------------------
os.environ['DJANGO_SETTINGS_MODULE'] = 'news_trader.settings'  # Nombre del módulo de settings de Django
import django
django.setup()

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'News Trader'
copyright = '2025, Iván Soto Cobos'
author = 'Iván Soto Cobos'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    'sphinx_autodoc_typehints',
]
html_theme = "sphinx_rtd_theme"

templates_path = ['_templates']
exclude_patterns = []

language = 'es'

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'alabaster'
html_static_path = ['_static']
