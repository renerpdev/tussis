export class IssueReport {
  [date: string]: {
    symptoms: {
      [key: string]: number
    }
    meds: { [key: string]: number }
    total: number
  }
}
