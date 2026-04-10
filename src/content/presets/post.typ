#let post(body, title: none, slug: none, date: none, tags: ()) = [
  #metadata((
    title: title,
    slug: slug,
    date: date,
    tags: tags,
  ))<frontmatter>

  #set page(width: auto, height: auto, margin: 0pt)
  #set par(justify: true, leading: 0.85em)

  #body
]
