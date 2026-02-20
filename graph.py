"""LangGraph Server entry point for BASIS Expert Council."""
from dotenv import load_dotenv
load_dotenv()

from src.basis_expert_council.agent import create_basis_expert_agent

agent = create_basis_expert_agent()
