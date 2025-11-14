export default async function ExperimentsPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/experiments`,
    {
      cache: 'no-store',
    }
  )
  const { experiments } = await response.json()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Experiments</h1>
      <div className="space-y-4">
        {experiments?.length > 0 ? (
          experiments.map((exp: any) => (
            <div key={exp.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{exp.testName || exp.experimentId}</h2>
              <p className="text-gray-600">{exp.experimentId}</p>
              {exp.vertical && (
                <p className="text-sm text-gray-500">Vertical: {exp.vertical}</p>
              )}
              {exp.geo && (
                <p className="text-sm text-gray-500">Geo: {exp.geo}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No experiments found. Add some data to get started!</p>
        )}
      </div>
    </div>
  )
}

