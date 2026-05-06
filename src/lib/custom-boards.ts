export interface CustomBoard {
  id: string
  title: string
  subtitle: string
  type: 'group' | 'member'
  createdBy: string   // user.id
  createdAt: string
}

const KEY = 'idol_custom_boards'

export function getCustomBoards(): CustomBoard[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveCustomBoard(board: CustomBoard): void {
  const boards = getCustomBoards()
  localStorage.setItem(KEY, JSON.stringify([...boards, board]))
}

export function deleteCustomBoard(id: string): void {
  const boards = getCustomBoards().filter((b) => b.id !== id)
  localStorage.setItem(KEY, JSON.stringify(boards))
}
