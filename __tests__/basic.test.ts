import { describe, it, expect } from 'vitest'

describe('HubLab Basic Tests', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true)
  })

  it('should have correct version format', () => {
    const version = '1.0.0'
    expect(version).toMatch(/^\d+\.\d+\.\d+$/)
  })
})
