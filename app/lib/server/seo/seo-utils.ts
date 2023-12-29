import type { BuildTagsParams, OpenGraphMedia } from "./types"

const defaults = {
  templateTitle: "",
  noindex: false,
  nofollow: false,
  norobots: false,
  defaultOpenGraphImageWidth: 0,
  defaultOpenGraphImageHeight: 0,
  defaultOpenGraphVideoWidth: 0,
  defaultOpenGraphVideoHeight: 0,
}

const buildOpenGraphMediaTags = (
  mediaType: "image" | "video" | "audio",
  media: ReadonlyArray<OpenGraphMedia> = [],
  {
    defaultWidth,
    defaultHeight,
  }: { defaultWidth?: number; defaultHeight?: number } = {}
) => {
  return media.reduce(
    (tags, medium, index) => {
      tags.push({
        property: `og:${mediaType}`,
        content: medium.url.toString(),
      })

      if (medium.alt) {
        tags.push({
          property: `og:${mediaType}:alt`,
          content: medium.alt.toString(),
        })
      }

      if (medium.secureUrl) {
        tags.push({
          property: `og:${mediaType}:secure_url`,
          content: medium.secureUrl.toString(),
        })
      }

      if (medium.type) {
        tags.push({
          property: `og:${mediaType}:type`,
          content: medium.type.toString(),
        })
      }

      if (medium.width) {
        tags.push({
          property: `og:${mediaType}:width`,
          content: medium.width.toString(),
        })
      } else if (defaultWidth) {
        tags.push({
          property: `og:${mediaType}:width`,
          content: defaultWidth.toString(),
        })
      }

      if (medium.height) {
        tags.push({
          property: `og:${mediaType}:height`,
          content: medium.height.toString(),
        })
      } else if (defaultHeight) {
        tags.push({
          property: `og:${mediaType}:height`,
          content: defaultHeight.toString(),
        })
      }

      return tags
    },
    [] as Record<string, string>[]
  )
}

const buildTags = (config: BuildTagsParams) => {
  const tagsToRender: Record<string, string | undefined>[] = []

  if (config.titleTemplate) {
    defaults.templateTitle = config.titleTemplate
  }

  let updatedTitle = ""
  if (config.title) {
    updatedTitle = config.title
    if (defaults.templateTitle) {
      updatedTitle = defaults.templateTitle.replace(/%s/g, () => updatedTitle)
    }
  } else if (config.defaultTitle) {
    updatedTitle = config.defaultTitle
  }

  if (updatedTitle) {
    // tagsToRender.push(<title key="title" > { updatedTitle } < /title>);
    tagsToRender.push({
      title: updatedTitle,
    })
  }

  const noindex =
    config.noindex === undefined
      ? defaults.noindex || config.dangerouslySetAllPagesToNoIndex
      : config.noindex

  const nofollow =
    config.nofollow === undefined
      ? defaults.nofollow || config.dangerouslySetAllPagesToNoFollow
      : config.nofollow

  const norobots = config.norobots || defaults.norobots

  let robotsParams = ""

  if (config.robotsProps) {
    const {
      nosnippet,
      maxSnippet,
      maxImagePreview,
      maxVideoPreview,
      noarchive,
      noimageindex,
      notranslate,
      unavailableAfter,
    } = config.robotsProps

    robotsParams = `${nosnippet ? ",nosnippet" : ""}${
      maxSnippet ? `,max-snippet:${maxSnippet}` : ""
    }${maxImagePreview ? `,max-image-preview:${maxImagePreview}` : ""}${
      noarchive ? ",noarchive" : ""
    }${unavailableAfter ? `,unavailable_after:${unavailableAfter}` : ""}${
      noimageindex ? ",noimageindex" : ""
    }${maxVideoPreview ? `,max-video-preview:${maxVideoPreview}` : ""}${
      notranslate ? ",notranslate" : ""
    }`
  }

  if (config.norobots) {
    defaults.norobots = true
  }

  if (noindex || nofollow) {
    if (config.dangerouslySetAllPagesToNoIndex) {
      defaults.noindex = true
    }
    if (config.dangerouslySetAllPagesToNoFollow) {
      defaults.nofollow = true
    }

    tagsToRender.push({
      property: "robots",
      content: `${noindex ? "noindex" : "index"},${
        nofollow ? "nofollow" : "follow"
      }${robotsParams}`,
    })
  } else if (!norobots || robotsParams) {
    tagsToRender.push({
      name: "robots",
      content: `index,follow${robotsParams}`,
    })
  }

  if (config.description) {
    tagsToRender.push({
      name: "description",
      content: config.description,
    })
  }

  if (config.themeColor) {
    tagsToRender.push({
      name: "theme-color",
      content: config.themeColor,
    })
  }

  if (config.mobileAlternate) {
    tagsToRender.push({
      tagName: "link",
      rel: "alternate",
      media: config.mobileAlternate.media,
      href: config.mobileAlternate.href,
    })
  }

  if (config.languageAlternates && config.languageAlternates.length > 0) {
    config.languageAlternates.forEach((languageAlternate: any) => {
      tagsToRender.push({
        tagName: "link",
        rel: "alternate",
        hrefLang: languageAlternate.hrefLang,
        href: languageAlternate.href,
      })
    })
  }

  if (config.twitter) {
    if (config.twitter.cardType) {
      tagsToRender.push({
        name: "twitter:card",
        content: config.twitter.cardType,
      })
    }

    if (config.twitter.site) {
      tagsToRender.push({
        name: "twitter:site",
        content: config.twitter.site,
      })
    }

    if (config.twitter.handle) {
      tagsToRender.push({
        name: "twitter:creator",
        content: config.twitter.handle,
      })
    }
  }

  if (config.facebook) {
    if (config.facebook.appId) {
      tagsToRender.push({
        property: "fb:app_id",
        content: config.facebook.appId,
      })
    }
  }

  if (config.openGraph?.title || updatedTitle) {
    tagsToRender.push({
      property: "og:title",
      content: config.openGraph?.title || updatedTitle,
    })
  }

  if (config.openGraph?.description || config.description) {
    tagsToRender.push({
      property: "og:description",
      content: config.openGraph?.description || config.description,
    })
  }

  if (config.openGraph) {
    if (config.openGraph.url || config.canonical) {
      tagsToRender.push({
        property: "og:url",
        content: config.openGraph.url || config.canonical,
      })
    }

    if (config.openGraph.type) {
      const type = config.openGraph.type.toLowerCase()

      tagsToRender.push({
        property: "og:type",
        content: type,
      })

      if (type === "profile" && config.openGraph.profile) {
        if (config.openGraph.profile.firstName) {
          tagsToRender.push({
            property: "profile:first_name",
            content: config.openGraph.profile.firstName,
          })
        }

        if (config.openGraph.profile.lastName) {
          tagsToRender.push({
            property: "profile:last_name",
            content: config.openGraph.profile.lastName,
          })
        }

        if (config.openGraph.profile.username) {
          tagsToRender.push({
            property: "profile:username",
            content: config.openGraph.profile.username,
          })
        }

        if (config.openGraph.profile.gender) {
          tagsToRender.push({
            property: "profile:gender",
            content: config.openGraph.profile.gender,
          })
        }
      } else if (type === "book" && config.openGraph.book) {
        if (
          config.openGraph.book.authors &&
          config.openGraph.book.authors.length
        ) {
          config.openGraph.book.authors.forEach((author: any) => {
            tagsToRender.push({
              property: "book:author",
              content: author,
            })
          })
        }

        if (config.openGraph.book.isbn) {
          tagsToRender.push({
            property: "book:isbn",
            content: config.openGraph.book.isbn,
          })
        }

        if (config.openGraph.book.releaseDate) {
          tagsToRender.push({
            property: "book:release_date",
            content: config.openGraph.book.releaseDate,
          })
        }

        if (config.openGraph.book.tags && config.openGraph.book.tags.length) {
          config.openGraph.book.tags.forEach((tag: any) => {
            tagsToRender.push({
              property: "book:tag",
              content: tag,
            })
          })
        }
      } else if (type === "article" && config.openGraph.article) {
        if (config.openGraph.article.publishedTime) {
          tagsToRender.push({
            property: "article:published_time",
            content: config.openGraph.article.publishedTime,
          })
        }

        if (config.openGraph.article.modifiedTime) {
          tagsToRender.push({
            property: "article:modified_time",
            content: config.openGraph.article.modifiedTime,
          })
        }

        if (config.openGraph.article.expirationTime) {
          tagsToRender.push({
            property: "article:expiration_time",
            content: config.openGraph.article.expirationTime,
          })
        }

        if (
          config.openGraph.article.authors &&
          config.openGraph.article.authors.length
        ) {
          config.openGraph.article.authors.forEach((author: any) => {
            tagsToRender.push({
              property: "article:author",
              content: author,
            })
          })
        }

        if (config.openGraph.article.section) {
          tagsToRender.push({
            property: "article:section",
            content: config.openGraph.article.section,
          })
        }

        if (
          config.openGraph.article.tags &&
          config.openGraph.article.tags.length
        ) {
          config.openGraph.article.tags.forEach((tag, index) => {
            tagsToRender.push({
              property: "article:tag",
              content: tag,
            })
          })
        }
      } else if (
        (type === "video.movie" ||
          type === "video.episode" ||
          type === "video.tv_show" ||
          type === "video.other") &&
        config.openGraph.video
      ) {
        if (
          config.openGraph.video.actors &&
          config.openGraph.video.actors.length
        ) {
          config.openGraph.video.actors.forEach((actor, index) => {
            if (actor.profile) {
              tagsToRender.push({
                property: "video:actor",
                content: actor.profile,
              })
            }

            if (actor.role) {
              tagsToRender.push({
                property: "video:actor:role",
                content: actor.role,
              })
            }
          })
        }

        if (
          config.openGraph.video.directors &&
          config.openGraph.video.directors.length
        ) {
          config.openGraph.video.directors.forEach((director, index) => {
            tagsToRender.push({
              property: "video:director",
              content: director,
            })
          })
        }

        if (
          config.openGraph.video.writers &&
          config.openGraph.video.writers.length
        ) {
          config.openGraph.video.writers.forEach((writer, index) => {
            tagsToRender.push({
              property: "video:writer",
              content: writer,
            })
          })
        }

        if (config.openGraph.video.duration) {
          tagsToRender.push({
            property: "video:duration",
            content: config.openGraph.video.duration.toString(),
          })
        }

        if (config.openGraph.video.releaseDate) {
          tagsToRender.push({
            property: "video:release_date",
            content: config.openGraph.video.releaseDate,
          })
        }

        if (config.openGraph.video.tags && config.openGraph.video.tags.length) {
          config.openGraph.video.tags.forEach((tag, index) => {
            tagsToRender.push({
              property: "video:tag",
              content: tag,
            })
          })
        }

        if (config.openGraph.video.series) {
          tagsToRender.push({
            property: "video:series",
            content: config.openGraph.video.series,
          })
        }
      }
    }

    // images
    if (config.defaultOpenGraphImageWidth) {
      defaults.defaultOpenGraphImageWidth = config.defaultOpenGraphImageWidth
    }

    if (config.defaultOpenGraphImageHeight) {
      defaults.defaultOpenGraphImageHeight = config.defaultOpenGraphImageHeight
    }

    if (config.openGraph.images && config.openGraph.images.length) {
      tagsToRender.push(
        ...buildOpenGraphMediaTags("image", config.openGraph.images, {
          defaultWidth: defaults.defaultOpenGraphImageWidth,
          defaultHeight: defaults.defaultOpenGraphImageHeight,
        })
      )
    }

    // videos
    if (config.defaultOpenGraphVideoWidth) {
      defaults.defaultOpenGraphVideoWidth = config.defaultOpenGraphVideoWidth
    }

    if (config.defaultOpenGraphVideoHeight) {
      defaults.defaultOpenGraphVideoHeight = config.defaultOpenGraphVideoHeight
    }

    if (config.openGraph.videos && config.openGraph.videos.length) {
      tagsToRender.push(
        ...buildOpenGraphMediaTags("video", config.openGraph.videos, {
          defaultWidth: defaults.defaultOpenGraphVideoWidth,
          defaultHeight: defaults.defaultOpenGraphVideoHeight,
        })
      )
    }

    // audio
    if (config.openGraph.audio) {
      tagsToRender.push(
        ...buildOpenGraphMediaTags("audio", config.openGraph.audio)
      )
    }

    if (config.openGraph.locale) {
      tagsToRender.push({
        property: "og:locale",
        content: config.openGraph.locale,
      })
    }

    if (config.openGraph.siteName || config.openGraph.site_name) {
      tagsToRender.push({
        property: "og:site_name",
        content: config.openGraph.siteName || config.openGraph.site_name,
      })
    }
  }

  if (config.canonical) {
    tagsToRender.push({
      tagName: "link",
      rel: "canonical",
      href: config.canonical,
    })
  }

  if (config.additionalMetaTags && config.additionalMetaTags.length > 0) {
    config.additionalMetaTags.forEach(({ keyOverride, ...tag }) => {
      tagsToRender.push({
        ...tag,
      })
    })
  }

  return tagsToRender
}

export default buildTags
