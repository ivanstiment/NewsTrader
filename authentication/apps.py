"""
Configuración de la aplicación Django para el módulo de autenticación.

Define la configuración necesaria para que Django reconozca
el módulo authentication como una aplicación instalada.
"""

from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    """
    Configuración de la aplicación de autenticación.
    
    Establece la configuración básica necesaria para que Django
    maneje correctamente el módulo de autenticación como una
    aplicación independiente.
    """
    
    default_auto_field = "django.db.models.BigAutoField"
    name = "authentication"
    verbose_name = "Authentication System"
    
    def ready(self):
        """
        Ejecuta código de inicialización cuando la aplicación está lista.
        
        Se ejecuta una vez que Django ha cargado completamente la aplicación.
        Útil para registrar señales, inicializar servicios, etc.
        """
        
        pass