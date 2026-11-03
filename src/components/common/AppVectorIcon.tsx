import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../theme/colors';

export type VectorIconName =
  | 'star'
  | 'trophy'
  | 'location'
  | 'users'
  | 'clock'
  | 'calendar'
  | 'search'
  | 'filter'
  | 'gift'
  | 'chart'
  | 'bolt'
  | 'check'
  | 'close'
  | 'user'
  | 'building'
  | 'sparkle'
  | 'crown'
  | 'shield'
  | 'medal'
  | 'target'
  | 'arrow-left'
  | 'arrow-right';

interface AppVectorIconProps {
  name: VectorIconName;
  size?: number;
  color?: string;
}

export const AppVectorIcon: React.FC<AppVectorIconProps> = ({
  name,
  size = 16,
  color = COLORS.primary,
}) => {
  const s = size;
  const stroke = Math.max(1.5, s * 0.11);

  if (name === 'location') {
    const pinSize = s * 0.72;
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            width: pinSize,
            height: pinSize,
            borderRadius: pinSize / 2,
            borderBottomRightRadius: 2,
            borderWidth: stroke,
            borderColor: color,
            transform: [{ rotate: '45deg' }],
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -s * 0.08,
          }}
        >
          <View
            style={{
              width: pinSize * 0.34,
              height: pinSize * 0.34,
              borderRadius: pinSize * 0.17,
              backgroundColor: color,
            }}
          />
        </View>
      </View>
    );
  }

  if (name === 'users') {
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 1 }}>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: s * 0.34,
                height: s * 0.34,
                borderRadius: s * 0.17,
                borderWidth: stroke,
                borderColor: color,
                marginBottom: 1,
              }}
            />
            <View
              style={{
                width: s * 0.58,
                height: s * 0.32,
                borderWidth: stroke,
                borderBottomWidth: 0,
                borderColor: color,
                borderTopLeftRadius: s * 0.28,
                borderTopRightRadius: s * 0.28,
              }}
            />
          </View>
          <View style={{ alignItems: 'center', marginLeft: -s * 0.14 }}>
            <View
              style={{
                width: s * 0.28,
                height: s * 0.28,
                borderRadius: s * 0.14,
                borderWidth: stroke * 0.9,
                borderColor: color,
                marginBottom: 1,
              }}
            />
            <View
              style={{
                width: s * 0.44,
                height: s * 0.25,
                borderWidth: stroke * 0.9,
                borderBottomWidth: 0,
                borderColor: color,
                borderTopLeftRadius: s * 0.22,
                borderTopRightRadius: s * 0.22,
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  if (name === 'user') {
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            width: s * 0.38,
            height: s * 0.38,
            borderRadius: s * 0.19,
            borderWidth: stroke,
            borderColor: color,
            marginBottom: 1.5,
          }}
        />
        <View
          style={{
            width: s * 0.72,
            height: s * 0.36,
            borderWidth: stroke,
            borderBottomWidth: 0,
            borderColor: color,
            borderTopLeftRadius: s * 0.35,
            borderTopRightRadius: s * 0.35,
          }}
        />
      </View>
    );
  }

  if (name === 'clock') {
    const r = s * 0.84;
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            width: r,
            height: r,
            borderRadius: r / 2,
            borderWidth: stroke,
            borderColor: color,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: stroke,
              height: r * 0.28,
              backgroundColor: color,
              top: r * 0.18,
              borderRadius: 1,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: r * 0.24,
              height: stroke,
              backgroundColor: color,
              right: r * 0.2,
              borderRadius: 1,
            }}
          />
        </View>
      </View>
    );
  }

  if (name === 'calendar') {
    const w = s * 0.82;
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            width: w,
            height: w,
            borderRadius: 3,
            borderWidth: stroke,
            borderColor: color,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: w * 0.28,
              backgroundColor: color,
              width: '100%',
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}
          >
            <View
              style={{
                width: stroke * 1.2,
                height: stroke * 1.2,
                borderRadius: 1,
                backgroundColor: color,
              }}
            />
            <View
              style={{
                width: stroke * 1.2,
                height: stroke * 1.2,
                borderRadius: 1,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  if (name === 'search') {
    const lens = s * 0.62;
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            width: lens,
            height: lens,
            borderRadius: lens / 2,
            borderWidth: stroke,
            borderColor: color,
            marginTop: -s * 0.14,
            marginLeft: -s * 0.14,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: s * 0.34,
            height: stroke,
            backgroundColor: color,
            bottom: s * 0.18,
            right: s * 0.12,
            transform: [{ rotate: '45deg' }],
            borderRadius: 1,
          }}
        />
      </View>
    );
  }

  if (name === 'filter') {
    return (
      <View style={[styles.canvas, { width: s, height: s, gap: s * 0.16 }]}>
        <View
          style={{
            width: s * 0.82,
            height: stroke,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
        <View
          style={{
            width: s * 0.56,
            height: stroke,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
        <View
          style={{
            width: s * 0.3,
            height: stroke,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      </View>
    );
  }

  if (name === 'trophy' || name === 'medal') {
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            width: s * 0.58,
            height: s * 0.48,
            borderWidth: stroke,
            borderColor: color,
            borderBottomLeftRadius: s * 0.28,
            borderBottomRightRadius: s * 0.28,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        />
        <View
          style={{
            width: stroke,
            height: s * 0.18,
            backgroundColor: color,
          }}
        />
        <View
          style={{
            width: s * 0.44,
            height: stroke,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      </View>
    );
  }

  if (name === 'crown') {
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: s * 0.08,
          }}
        >
          <View
            style={{
              width: s * 0.18,
              height: s * 0.42,
              backgroundColor: color,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }}
          />
          <View
            style={{
              width: s * 0.22,
              height: s * 0.62,
              backgroundColor: color,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }}
          />
          <View
            style={{
              width: s * 0.18,
              height: s * 0.42,
              backgroundColor: color,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }}
          />
        </View>
        <View
          style={{
            width: s * 0.72,
            height: stroke * 1.2,
            backgroundColor: color,
            marginTop: 2,
            borderRadius: 1,
          }}
        />
      </View>
    );
  }

  if (name === 'gift') {
    const box = s * 0.72;
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            width: box * 0.5,
            height: s * 0.16,
            borderWidth: stroke * 0.9,
            borderColor: color,
            borderBottomWidth: 0,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        />
        <View
          style={{
            width: box,
            height: box * 0.78,
            borderWidth: stroke,
            borderColor: color,
            borderRadius: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: stroke,
              height: '100%',
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              height: stroke,
              width: '100%',
              backgroundColor: color,
            }}
          />
        </View>
      </View>
    );
  }

  if (name === 'chart') {
    return (
      <View
        style={[
          styles.canvas,
          {
            width: s,
            height: s,
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: s * 0.1,
            paddingBottom: s * 0.12,
          },
        ]}
      >
        <View
          style={{
            width: s * 0.16,
            height: s * 0.36,
            backgroundColor: color,
            borderRadius: 1.5,
          }}
        />
        <View
          style={{
            width: s * 0.16,
            height: s * 0.56,
            backgroundColor: color,
            borderRadius: 1.5,
          }}
        />
        <View
          style={{
            width: s * 0.16,
            height: s * 0.78,
            backgroundColor: color,
            borderRadius: 1.5,
          }}
        />
      </View>
    );
  }

  if (name === 'building') {
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            width: s * 0.68,
            height: s * 0.8,
            borderWidth: stroke,
            borderColor: color,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            alignItems: 'center',
            justifyContent: 'space-evenly',
            paddingVertical: 2,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 3 }}>
            <View
              style={{ width: 2.5, height: 2.5, backgroundColor: color }}
            />
            <View
              style={{ width: 2.5, height: 2.5, backgroundColor: color }}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 3 }}>
            <View
              style={{ width: 2.5, height: 2.5, backgroundColor: color }}
            />
            <View
              style={{ width: 2.5, height: 2.5, backgroundColor: color }}
            />
          </View>
        </View>
      </View>
    );
  }

  if (name === 'target') {
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            width: s * 0.82,
            height: s * 0.82,
            borderRadius: s * 0.41,
            borderWidth: stroke,
            borderColor: color,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: s * 0.34,
              height: s * 0.34,
              borderRadius: s * 0.17,
              backgroundColor: color,
            }}
          />
        </View>
      </View>
    );
  }

  if (name === 'check') {
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            width: s * 0.56,
            height: s * 0.3,
            borderLeftWidth: stroke * 1.2,
            borderBottomWidth: stroke * 1.2,
            borderColor: color,
            transform: [{ rotate: '-45deg' }],
            marginTop: -s * 0.08,
          }}
        />
      </View>
    );
  }

  if (name === 'close') {
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            position: 'absolute',
            width: s * 0.72,
            height: stroke * 1.1,
            backgroundColor: color,
            transform: [{ rotate: '45deg' }],
            borderRadius: 1,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: s * 0.72,
            height: stroke * 1.1,
            backgroundColor: color,
            transform: [{ rotate: '-45deg' }],
            borderRadius: 1,
          }}
        />
      </View>
    );
  }

  if (name === 'arrow-left' || name === 'arrow-right') {
    const isLeft = name === 'arrow-left';
    return (
      <View style={[styles.canvas, { width: s, height: s }]}>
        <View
          style={{
            width: s * 0.42,
            height: s * 0.42,
            borderLeftWidth: isLeft ? stroke * 1.2 : 0,
            borderBottomWidth: isLeft ? stroke * 1.2 : 0,
            borderRightWidth: !isLeft ? stroke * 1.2 : 0,
            borderTopWidth: !isLeft ? stroke * 1.2 : 0,
            borderColor: color,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
    );
  }

  // Default: 'star' / 'sparkle' / 'bolt' / 'shield' geometric 4-point diamond star
  const d = s * 0.54;
  return (
    <View style={[styles.canvas, { width: s, height: s }]}>
      <View
        style={{
          position: 'absolute',
          width: d,
          height: d,
          backgroundColor: color,
          borderRadius: 2,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: d,
          height: d,
          borderWidth: stroke,
          borderColor: color,
          borderRadius: 2,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});