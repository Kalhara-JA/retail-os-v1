'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { Button, FieldLabel } from '@payloadcms/ui'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'

interface SeedFile {
  name: string
  path: string
  size: number
  createdAt: string
  description?: string
}

interface SeedFileManagerProps {
  className?: string
}

export const SeedFileManager: React.FC<SeedFileManagerProps> = ({ className }) => {
  const [seedFiles, setSeedFiles] = useState<SeedFile[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string>('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    description: '',
    includeUsers: false,
  })

  const loadSeedFiles = useCallback(async () => {
    try {
      const response = await fetch('/api/seed-files/list', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setSeedFiles(data.files || [])
      } else {
        console.error('Failed to load seed files')
      }
    } catch (_error) {
      console.error('Error loading seed files:', _error)
    }
  }, [])

  // Load seed files on component mount
  useEffect(() => {
    loadSeedFiles()
  }, [loadSeedFiles])

  const handleGenerateSeedFile = useCallback(async () => {
    setLoading(true)
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `seed-${timestamp}.json`

      const response = await fetch('/api/generate-seed-file', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outputPath: `./src/endpoints/seed/files/${fileName}`,
          includeUsers: createFormData.includeUsers,
          description: createFormData.description,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`Seed file generated successfully: ${result.outputPath}`)
        setShowCreateForm(false)
        setCreateFormData({ description: '', includeUsers: false })
        loadSeedFiles() // Reload the list
      } else {
        toast.error('Failed to generate seed file')
      }
    } catch (_error) {
      toast.error('Error generating seed file')
    } finally {
      setLoading(false)
    }
  }, [createFormData, loadSeedFiles])

  const handleSeedFromFile = useCallback(async (filePath: string) => {
    if (!filePath) {
      toast.error('Please select a seed file')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/seed-from-file', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seedFilePath: filePath,
          clearExisting: true,
        }),
      })

      if (response.ok) {
        toast.success('Database seeded successfully from file!')
        setSelectedFile('')
      } else {
        toast.error('Failed to seed from file')
      }
    } catch (_error) {
      toast.error('Error seeding from file')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDeleteSeedFile = useCallback(
    async (filePath: string) => {
      if (!confirm('Are you sure you want to delete this seed file?')) {
        return
      }

      try {
        const response = await fetch('/api/seed-files/delete', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePath }),
        })

        if (response.ok) {
          toast.success('Seed file deleted successfully')
          loadSeedFiles() // Reload the list
        } else {
          toast.error('Failed to delete seed file')
        }
      } catch (_error) {
        toast.error('Error deleting seed file')
      }
    },
    [loadSeedFiles],
  )

  const handleDownloadSeedFile = useCallback(async (filePath: string, fileName: string) => {
    try {
      const response = await fetch('/api/seed-files/download', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Seed file downloaded successfully')
      } else {
        toast.error('Failed to download seed file')
      }
    } catch (_error) {
      toast.error('Error downloading seed file')
    }
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Seed File Manager</h3>
          <p className="text-sm text-muted-foreground">
            Generate, manage, and use seed files for database operations
          </p>
        </CardHeader>

        <CardContent>
          {/* Action Buttons */}
          <div className="flex gap-2 mb-6">
            <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
              Generate New Seed File
            </Button>

            <Button onClick={loadSeedFiles} buttonStyle="secondary">
              Refresh List
            </Button>
          </div>

          {/* Create Seed File Form */}
          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <h4 className="text-base font-medium">Generate New Seed File</h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <FieldLabel label="Description (optional)" />
                  <Input
                    value={createFormData.description}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="e.g., Production data backup, Development setup"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeUsers"
                    checked={createFormData.includeUsers}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({ ...prev, includeUsers: e.target.checked }))
                    }
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="includeUsers" className="text-sm">
                    Include user accounts in seed file
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleGenerateSeedFile} disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Seed File'}
                  </Button>

                  <Button onClick={() => setShowCreateForm(false)} buttonStyle="secondary">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator className="my-6" />

          {/* Seed Files List */}
          <div>
            <h4 className="text-base font-medium mb-4">Available Seed Files</h4>

            {seedFiles.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No seed files found. Generate your first seed file above.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {seedFiles.map((file) => (
                  <Card key={file.path}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium">{file.name}</h5>
                            {selectedFile === file.path && (
                              <Badge variant="default">Selected</Badge>
                            )}
                          </div>

                          {file.description && (
                            <p className="text-sm text-muted-foreground mb-2">{file.description}</p>
                          )}

                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>Size: {formatFileSize(file.size)}</div>
                            <div>Created: {formatDate(file.createdAt)}</div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => setSelectedFile(file.path)}
                            buttonStyle="secondary"
                            size="small"
                          >
                            Select
                          </Button>

                          <Button
                            onClick={() => handleDownloadSeedFile(file.path, file.name)}
                            buttonStyle="secondary"
                            size="small"
                          >
                            Download
                          </Button>

                          <Button
                            onClick={() => handleDeleteSeedFile(file.path)}
                            buttonStyle="error"
                            size="small"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Seed from Selected File */}
          {selectedFile && (
            <Card className="mt-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardHeader>
                <h4 className="text-base font-medium text-blue-900 dark:text-blue-100">
                  Seed Database from Selected File
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Selected: <strong>{seedFiles.find((f) => f.path === selectedFile)?.name}</strong>
                </p>
              </CardHeader>
              <CardFooter className="flex gap-2">
                <Button
                  onClick={() => handleSeedFromFile(selectedFile)}
                  disabled={loading}
                  buttonStyle="error"
                >
                  {loading ? 'Seeding Database...' : 'Seed Database Now'}
                </Button>

                <Button onClick={() => setSelectedFile('')} buttonStyle="secondary">
                  Cancel
                </Button>
              </CardFooter>
              <CardContent className="pt-0">
                <p className="text-xs text-red-600 dark:text-red-400">
                  ⚠️ Warning: This will replace all existing data in the database!
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
