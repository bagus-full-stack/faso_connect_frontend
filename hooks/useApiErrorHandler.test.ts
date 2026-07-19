import { renderHook, act } from '@testing-library/react';
import { useApiErrorHandler } from './useApiErrorHandler';
import { ApiError } from '@/lib/types';
import { toast } from 'sonner';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('useApiErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle 400 unknown language error', () => {
    const { result } = renderHook(() => useApiErrorHandler());

    act(() => {
      result.current.handleError(new ApiError(400, 'Unknown language'));
    });

    expect(toast.error).toHaveBeenCalledWith('Langue inconnue ou non supportée.', expect.any(Object));
    expect(result.current.apiError).toBe('Unknown language');
    expect(result.current.validationError).toBeNull();
    expect(result.current.fieldErrors).toEqual({});
  });

  it('should handle 422 speed error', () => {
    const { result } = renderHook(() => useApiErrorHandler());

    act(() => {
      result.current.handleError(new ApiError(422, 'Invalid speed value'));
    });

    expect(toast.error).not.toHaveBeenCalled();
    expect(result.current.validationError).toBe('Invalid speed value');
    expect(result.current.fieldErrors).toEqual({
      speed: 'La vitesse doit être comprise entre 0.5x et 2.0x.'
    });
  });

  it('should handle 422 text missing error', () => {
    const { result } = renderHook(() => useApiErrorHandler());

    act(() => {
      result.current.handleError(new ApiError(422, 'Text is required'));
    });

    expect(toast.error).not.toHaveBeenCalled();
    expect(result.current.fieldErrors).toEqual({
      text: 'Ce champ est requis.'
    });
  });

  it('should handle 5xx server error', () => {
    const { result } = renderHook(() => useApiErrorHandler());

    act(() => {
      result.current.handleError(new ApiError(500, 'Internal Server Error'));
    });

    expect(toast.error).toHaveBeenCalledWith('Une erreur est survenue, réessayez.', expect.any(Object));
    expect(result.current.apiError).toBe('Internal Server Error');
  });

  it('should handle network error', () => {
    const { result } = renderHook(() => useApiErrorHandler());

    act(() => {
      result.current.handleError(new Error('Failed to fetch'));
    });

    expect(toast.error).toHaveBeenCalledWith('Erreur réseau', expect.any(Object));
    expect(result.current.apiError).toBe('Failed to fetch');
  });

  it('should clear errors', () => {
    const { result } = renderHook(() => useApiErrorHandler());

    act(() => {
      result.current.handleError(new ApiError(422, 'Invalid speed'));
    });
    
    expect(result.current.fieldErrors).not.toEqual({});

    act(() => {
      result.current.clearErrors();
    });

    expect(result.current.apiError).toBeNull();
    expect(result.current.validationError).toBeNull();
    expect(result.current.fieldErrors).toEqual({});
  });
});
