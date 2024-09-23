/// <reference types="mdast" />
import { h } from 'hastscript'

/**
 * Creates a GitHub Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.name
 * @param {string} properties.url
 * @param {string} properties.avatar
 * @param {string} properties.content
 * @returns {import('mdast').Parent} The created GitHub Card component.
 */
export function PersonalCardComponent(properties) {
  return h('div', [
    h(
      'a',
      { href: properties.url, target: '_blank', rel: 'noopener noreferrer' },
      [
        h('div', [
          h('img', {
            src: properties.avatar,
            alt: `${properties.name}'s avatar`,
          }),
          h('h2', properties.name),
        ]),
        h('div', properties.content),
      ],
    ),
  ])
}
