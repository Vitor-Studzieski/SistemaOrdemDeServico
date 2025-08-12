export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      assinaturas_semanais: {
        Row: {
          assinatura: string | null
          data: string | null
          id: string
          semana: number | null
          user_id: string | null
        }
        Insert: {
          assinatura?: string | null
          data?: string | null
          id?: string
          semana?: number | null
          user_id?: string | null
        }
        Update: {
          assinatura?: string | null
          data?: string | null
          id?: string
          semana?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_semanais_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cabecalho: {
        Row: {
          aprovado_por: string | null
          cnpj: string | null
          codigo_documento: string | null
          elaborado_em: string | null
          elaborado_por: string | null
          frequencia: string | null
          id: string
          nome_empresa: string
          nome_planilha: string
          revisado_em: string | null
          revisao: string | null
          user_id: string | null
        }
        Insert: {
          aprovado_por?: string | null
          cnpj?: string | null
          codigo_documento?: string | null
          elaborado_em?: string | null
          elaborado_por?: string | null
          frequencia?: string | null
          id?: string
          nome_empresa?: string
          nome_planilha?: string
          revisado_em?: string | null
          revisao?: string | null
          user_id?: string | null
        }
        Update: {
          aprovado_por?: string | null
          cnpj?: string | null
          codigo_documento?: string | null
          elaborado_em?: string | null
          elaborado_por?: string | null
          frequencia?: string | null
          id?: string
          nome_empresa?: string
          nome_planilha?: string
          revisado_em?: string | null
          revisao?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cabecalho_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cabecalho_limpeza: {
        Row: {
          aprovado_por: string | null
          cnpj: string | null
          codigo_documento: string | null
          elaborado_em: string | null
          elaborado_por: string | null
          frequencia: string | null
          id: string
          mes_ano: string | null
          nome_empresa: string
          nome_planilha: string
          revisado_em: string | null
          revisao: string | null
          setor: string | null
          user_id: string | null
        }
        Insert: {
          aprovado_por?: string | null
          cnpj?: string | null
          codigo_documento?: string | null
          elaborado_em?: string | null
          elaborado_por?: string | null
          frequencia?: string | null
          id?: string
          mes_ano?: string | null
          nome_empresa?: string
          nome_planilha?: string
          revisado_em?: string | null
          revisao?: string | null
          setor?: string | null
          user_id?: string | null
        }
        Update: {
          aprovado_por?: string | null
          cnpj?: string | null
          codigo_documento?: string | null
          elaborado_em?: string | null
          elaborado_por?: string | null
          frequencia?: string | null
          id?: string
          mes_ano?: string | null
          nome_empresa?: string
          nome_planilha?: string
          revisado_em?: string | null
          revisao?: string | null
          setor?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cabecalho_limpeza_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cabecalho_recebimento: {
        Row: {
          assinatura: string | null
          codigo_doc: string | null
          created_at: string
          elaborado_em: string | null
          elaborado_por: string | null
          id: string
          mes: string
          responsavel: string
          revisado_em: string | null
          revisado_por: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assinatura?: string | null
          codigo_doc?: string | null
          created_at?: string
          elaborado_em?: string | null
          elaborado_por?: string | null
          id?: string
          mes: string
          responsavel: string
          revisado_em?: string | null
          revisado_por?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assinatura?: string | null
          codigo_doc?: string | null
          created_at?: string
          elaborado_em?: string | null
          elaborado_por?: string | null
          id?: string
          mes?: string
          responsavel?: string
          revisado_em?: string | null
          revisado_por?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cabecalho_temperatura_umidade: {
        Row: {
          aprovado_por: string | null
          cnpj: string | null
          codigo_documento: string | null
          elaborado_em: string | null
          elaborado_por: string | null
          frequencia: string | null
          id: string
          nome_empresa: string
          nome_planilha: string
          revisado_em: string | null
          revisao: string | null
          user_id: string | null
        }
        Insert: {
          aprovado_por?: string | null
          cnpj?: string | null
          codigo_documento?: string | null
          elaborado_em?: string | null
          elaborado_por?: string | null
          frequencia?: string | null
          id?: string
          nome_empresa?: string
          nome_planilha?: string
          revisado_em?: string | null
          revisao?: string | null
          user_id?: string | null
        }
        Update: {
          aprovado_por?: string | null
          cnpj?: string | null
          codigo_documento?: string | null
          elaborado_em?: string | null
          elaborado_por?: string | null
          frequencia?: string | null
          id?: string
          nome_empresa?: string
          nome_planilha?: string
          revisado_em?: string | null
          revisao?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cabecalho_temperatura_umidade_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      controle_recebimentos: {
        Row: {
          created_at: string
          data_recebimento: string
          fornecedor: string | null
          id: string
          id_cabecalho: string
          lote: string | null
          observacoes: string | null
          produto_recebido: string
          quantidade: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_recebimento: string
          fornecedor?: string | null
          id?: string
          id_cabecalho: string
          lote?: string | null
          observacoes?: string | null
          produto_recebido: string
          quantidade?: number | null
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_recebimento?: string
          fornecedor?: string | null
          id?: string
          id_cabecalho?: string
          lote?: string | null
          observacoes?: string | null
          produto_recebido?: string
          quantidade?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "controle_recebimentos_id_cabecalho_fkey"
            columns: ["id_cabecalho"]
            isOneToOne: false
            referencedRelation: "cabecalho_recebimento"
            referencedColumns: ["id"]
          },
        ]
      }
      limpeza_detalhada: {
        Row: {
          assinatura: string | null
          data: string | null
          id: string
          id_cabecalho: string | null
          limpeza_pia: boolean | null
          limpeza_piso: boolean | null
          limpeza_vasos_sanitarios: boolean | null
          lixeiras_limpas: boolean | null
          reposicao_kit_higiene: boolean | null
          reposicao_papel_higienico: boolean | null
          user_id: string | null
        }
        Insert: {
          assinatura?: string | null
          data?: string | null
          id?: string
          id_cabecalho?: string | null
          limpeza_pia?: boolean | null
          limpeza_piso?: boolean | null
          limpeza_vasos_sanitarios?: boolean | null
          lixeiras_limpas?: boolean | null
          reposicao_kit_higiene?: boolean | null
          reposicao_papel_higienico?: boolean | null
          user_id?: string | null
        }
        Update: {
          assinatura?: string | null
          data?: string | null
          id?: string
          id_cabecalho?: string | null
          limpeza_pia?: boolean | null
          limpeza_piso?: boolean | null
          limpeza_vasos_sanitarios?: boolean | null
          lixeiras_limpas?: boolean | null
          reposicao_kit_higiene?: boolean | null
          reposicao_papel_higienico?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "limpeza_detalhada_id_cabecalho_fkey"
            columns: ["id_cabecalho"]
            isOneToOne: false
            referencedRelation: "cabecalho_limpeza"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "limpeza_detalhada_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      limpeza_instalacoes: {
        Row: {
          id: string
          id_assinaturas_semanais: string | null
          id_cabecalho: string | null
          instalacao: string | null
          periodicidade: string | null
          responsavel_verificacao: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          id_assinaturas_semanais?: string | null
          id_cabecalho?: string | null
          instalacao?: string | null
          periodicidade?: string | null
          responsavel_verificacao?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          id_assinaturas_semanais?: string | null
          id_cabecalho?: string | null
          instalacao?: string | null
          periodicidade?: string | null
          responsavel_verificacao?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "limpeza_instalacoes_id_assinaturas_semanais_fkey"
            columns: ["id_assinaturas_semanais"]
            isOneToOne: false
            referencedRelation: "assinaturas_semanais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "limpeza_instalacoes_id_cabecalho_fkey"
            columns: ["id_cabecalho"]
            isOneToOne: false
            referencedRelation: "cabecalho_limpeza"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "limpeza_instalacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nao_conformidades: {
        Row: {
          acoes_corretivas: string | null
          criado_em: string | null
          descricao: string | null
          id: string
          medidas_preventivas: string | null
          responsavel: string | null
          user_id: string | null
        }
        Insert: {
          acoes_corretivas?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          medidas_preventivas?: string | null
          responsavel?: string | null
          user_id?: string | null
        }
        Update: {
          acoes_corretivas?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          medidas_preventivas?: string | null
          responsavel?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nao_conformidades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      registros_temperatura_umidade: {
        Row: {
          criado_em: string | null
          data_hora: string
          id: string
          id_cabecalho: string | null
          id_nao_conformidade: string | null
          temperatura: number | null
          umidade: number | null
          user_id: string | null
        }
        Insert: {
          criado_em?: string | null
          data_hora: string
          id?: string
          id_cabecalho?: string | null
          id_nao_conformidade?: string | null
          temperatura?: number | null
          umidade?: number | null
          user_id?: string | null
        }
        Update: {
          criado_em?: string | null
          data_hora?: string
          id?: string
          id_cabecalho?: string | null
          id_nao_conformidade?: string | null
          temperatura?: number | null
          umidade?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_temperatura_umidade_id_cabecalho_fkey"
            columns: ["id_cabecalho"]
            isOneToOne: false
            referencedRelation: "cabecalho_temperatura_umidade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_temperatura_umidade_id_nao_conformidade_fkey"
            columns: ["id_nao_conformidade"]
            isOneToOne: false
            referencedRelation: "nao_conformidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_temperatura_umidade_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_order_parameters: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          nome: string
          order_id: string
          unidade: string | null
          user_id: string | null
          valor_maximo: number | null
          valor_minimo: number | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome: string
          order_id: string
          unidade?: string | null
          user_id?: string | null
          valor_maximo?: number | null
          valor_minimo?: number | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome?: string
          order_id?: string
          unidade?: string | null
          user_id?: string | null
          valor_maximo?: number | null
          valor_minimo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_order_parameters_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          atualizado_em: string
          criado_em: string
          descricao: string | null
          frequencia: string | null
          id: string
          prazo: string | null
          prioridade: string
          recorrente: boolean
          responsavel: string
          setor: string
          status: string
          titulo: string
          user_id: string | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          frequencia?: string | null
          id?: string
          prazo?: string | null
          prioridade: string
          recorrente?: boolean
          responsavel: string
          setor: string
          status?: string
          titulo: string
          user_id?: string | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          frequencia?: string | null
          id?: string
          prazo?: string | null
          prioridade?: string
          recorrente?: boolean
          responsavel?: string
          setor?: string
          status?: string
          titulo?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "usuario" | "consultora" | "desenvolvedor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["usuario", "consultora", "desenvolvedor"],
    },
  },
} as const
