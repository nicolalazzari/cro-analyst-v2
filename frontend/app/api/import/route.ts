import { NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db/client'
import { google } from 'googleapis'

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Get access token from session (added in NextAuth callbacks)
    const accessToken = (session as any).accessToken
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token available. Please sign in again.' },
        { status: 401 }
      )
    }

    const sheetsId = process.env.GOOGLE_SHEETS_ID
    const range = process.env.GOOGLE_SHEETS_RANGE || 'A:ZZ'

    if (!sheetsId) {
      return NextResponse.json(
        { error: 'GOOGLE_SHEETS_ID not configured' },
        { status: 500 }
      )
    }

    // Initialize Google Sheets API with user's access token
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: accessToken,
    })

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client })

    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetsId,
      range: range,
    })

    const rows = response.data.values
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'No data found in Google Sheets' },
        { status: 404 }
      )
    }

    // Assume first row is headers
    const headers = rows[0] as string[]
    const dataRows = rows.slice(1)

    // Map headers to database columns
    const headerMap: { [key: string]: string } = {
      'experiment_id': 'experiment_id',
      'experiment id': 'experiment_id',
      'test_name': 'test_name',
      'test name': 'test_name',
      'hypothesis': 'hypothesis',
      'lessons_learned': 'lessons_learned',
      'lessons learned': 'lessons_learned',
      'vertical': 'vertical',
      'geo': 'geo',
      'brand': 'brand',
      'date_launched': 'date_launched',
      'date launched': 'date_launched',
      'date_concluded': 'date_concluded',
      'date concluded': 'date_concluded',
      'winning_var': 'winning_var',
      'winning var': 'winning_var',
      'observed_revenue_impact': 'observed_revenue_impact',
      'observed revenue impact': 'observed_revenue_impact',
      'primary_metric_name': 'primary_metric_name',
      'primary metric name': 'primary_metric_name',
    }

    // Normalize headers (lowercase, trim)
    const normalizedHeaders = headers.map(h => h.toLowerCase().trim())
    
    // Import experiments
    let imported = 0
    let skipped = 0
    const errors: string[] = []

    for (const row of dataRows) {
      try {
        // Create object from row
        const rowData: { [key: string]: string } = {}
        normalizedHeaders.forEach((header, index) => {
          const dbColumn = headerMap[header]
          if (dbColumn && row[index]) {
            rowData[dbColumn] = String(row[index]).trim()
          }
        })

        // Skip if no experiment_id
        if (!rowData.experiment_id) {
          skipped++
          continue
        }

        // Upsert experiment
        await prisma.experiment.upsert({
          where: { experimentId: rowData.experiment_id },
          update: {
            testName: rowData.test_name || null,
            hypothesis: rowData.hypothesis || null,
            lessonsLearned: rowData.lessons_learned || null,
            vertical: rowData.vertical || null,
            geo: rowData.geo || null,
            brand: rowData.brand || null,
            dateLaunched: rowData.date_launched || null,
            dateConcluded: rowData.date_concluded || null,
            winningVar: rowData.winning_var || null,
            observedRevenueImpact: rowData.observed_revenue_impact || null,
            primaryMetricName: rowData.primary_metric_name || null,
          },
          create: {
            experimentId: rowData.experiment_id,
            testName: rowData.test_name || null,
            hypothesis: rowData.hypothesis || null,
            lessonsLearned: rowData.lessons_learned || null,
            vertical: rowData.vertical || null,
            geo: rowData.geo || null,
            brand: rowData.brand || null,
            dateLaunched: rowData.date_launched || null,
            dateConcluded: rowData.date_concluded || null,
            winningVar: rowData.winning_var || null,
            observedRevenueImpact: rowData.observed_revenue_impact || null,
            primaryMetricName: rowData.primary_metric_name || null,
          },
        })

        imported++
      } catch (error: any) {
        errors.push(`Row ${imported + skipped + 1}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      total: dataRows.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    console.error('Error importing data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to import data' },
      { status: 500 }
    )
  }
}

