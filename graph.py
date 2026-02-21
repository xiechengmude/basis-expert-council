"""LangGraph Server entry point for BasisPilot (贝领)."""
from dotenv import load_dotenv
load_dotenv()

from src.basis_expert_council.agent import create_basis_expert_agent_with_vision

agent = create_basis_expert_agent_with_vision()
