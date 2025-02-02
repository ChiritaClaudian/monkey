from functools import lru_cache

from common.agent_plugins import AgentPlugin, AgentPluginType

from . import IAgentPluginRepository


class AgentPluginRepositoryCachingDecorator(IAgentPluginRepository):
    """
    An IAgentPluginRepository decorator that provides caching for other IAgentPluginRepositories
    """

    def __init__(self, agent_plugin_repository: IAgentPluginRepository):
        self._agent_plugin_repository = agent_plugin_repository

    @lru_cache()
    def get_plugin(self, plugin_type: AgentPluginType, name: str) -> AgentPlugin:
        return self._agent_plugin_repository.get_plugin(plugin_type, name)
