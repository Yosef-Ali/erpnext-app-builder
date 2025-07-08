"""
Claude Hooks - Interface for Claude AI integration with ERPNext App Builder

This module provides hooks and interfaces for integrating Claude AI
with the ERPNext App Builder to enable intelligent app generation.
"""

from .hooks import ClaudeHooks
from .prompts import PromptManager
from .ai_interface import AIInterface

__all__ = ['ClaudeHooks', 'PromptManager', 'AIInterface']