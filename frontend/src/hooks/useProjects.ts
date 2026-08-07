import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectService } from '../services/api'; // Temporariamente utilizando api.ts

export const useProjects = () => {
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: ProjectService.getAll
  });

  const createMutation = useMutation({
    mutationFn: ProjectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => ProjectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: ProjectService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  return {
    projects,
    isLoading,
    error,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
