/**
 * HubLab API Client
 * Handles all API requests with authentication and error handling
 */

import type {
  Project,
  CreateProjectRequest,
  CreateProjectResponse,
  ExportRequest,
  ExportResponse,
  NativeExportRequest,
  NativeExportResponse,
  APIError,
} from '../../types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1'

class APIClient {
  private apiKey: string | null = null

  setApiKey(key: string) {
    this.apiKey = key
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      const error = data as APIError
      throw new Error(error.error?.message || 'API request failed')
    }

    return data as T
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await this.request<{ projects: Project[] }>('/projects')
    return response.projects
  }

  async getProject(id: string): Promise<Project> {
    const response = await this.request<{ project: Project }>(`/projects/${id}`)
    return response.project
  }

  async createProject(data: CreateProjectRequest): Promise<CreateProjectResponse> {
    return this.request<CreateProjectResponse>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await this.request<{ project: Project }>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.project
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // Capsules
  async addCapsule(projectId: string, capsule: { type: string; props: Record<string, any> }) {
    return this.request<{ capsule: any }>(`/projects/${projectId}/capsules`, {
      method: 'POST',
      body: JSON.stringify(capsule),
    })
  }

  async removeCapsule(projectId: string, capsuleId: string) {
    await this.request(`/projects/${projectId}/capsules/${capsuleId}`, {
      method: 'DELETE',
    })
  }

  // Export
  async exportProject(projectId: string, data: ExportRequest): Promise<ExportResponse> {
    return this.request<ExportResponse>(`/projects/${projectId}/export`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async exportNative(projectId: string, data: NativeExportRequest): Promise<NativeExportResponse> {
    return this.request<NativeExportResponse>(`/projects/${projectId}/export-native`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Capsule Catalog
  async getCapsuleCatalog() {
    return this.request<{ capsules: any[] }>('/capsules')
  }

  async getCapsule(id: string) {
    return this.request<{ capsule: any }>(`/capsules/${id}`)
  }
}

export const apiClient = new APIClient()
export default apiClient
