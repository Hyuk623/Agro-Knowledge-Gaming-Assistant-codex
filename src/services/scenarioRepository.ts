import { strawberryScenario, strawberryScenarioDays } from '../data/mockScenario';
import { supabase } from '../lib/supabaseClient';
import { Scenario, ScenarioDay } from '../types/domain';

export const scenarioRepository = {
  async getScenario(): Promise<Scenario> {
    if (!supabase) {
      return strawberryScenario;
    }

    // TODO (Phase 2): fetch active scenario row from Supabase.
    return strawberryScenario;
  },

  async getScenarioDays(): Promise<ScenarioDay[]> {
    if (!supabase) {
      return strawberryScenarioDays;
    }

    // TODO (Phase 2): fetch scenario_days rows from Supabase.
    return strawberryScenarioDays;
  }
};
