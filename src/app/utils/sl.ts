import sl from 'sweetalert2';

export async function prompt(title: string, text?: string) {
  const result = await sl.fire({
    title,
    text: text ?? '',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });
  return result.isConfirmed;
}
