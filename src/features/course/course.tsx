'use client';
import { useIdentity } from '@/features/learning/identity-foundations-provider';
import { IdentityLesson } from '@/features/learning/identity-foundations';
import {
  identityHref,
  identityTopics,
  type IdentityTopic,
} from '@/domain/curriculum/identity-foundations';
import { identityNb } from '@/content/nb';
import { useResilience } from '@/features/learning/storage-resilience-provider';
import { ResilienceLesson } from '@/features/learning/storage-resilience';
import {
  resilienceHref,
  resilienceTopics,
  type ResilienceTopic,
} from '@/domain/curriculum/storage-resilience';
import { storageResilienceNb } from '@/content/nb';
import { useStorage } from '@/features/learning/storage-provider';
import { StorageLesson } from '@/features/learning/storage';
import { storageHref, storageTopics, type StorageTopic } from '@/domain/curriculum/storage';
import { storageNb } from '@/content/nb';

import { useConnectivity } from '@/features/learning/connectivity-provider';
import { ConnectivityLesson } from '@/features/learning/connectivity';
import {
  connectivityHref,
  connectivityTopics,
  type ConnectivityTopic,
} from '@/domain/curriculum/connectivity';
import { connectivityNb } from '@/content/nb';
import { useNetworking } from '@/features/learning/networking-provider';
import { NetworkingLesson } from '@/features/learning/networking';
import {
  networkingHref,
  networkingTopics,
  type NetworkingTopic,
} from '@/domain/curriculum/networking';
import { networkingNb } from '@/content/nb';

import { useManagement } from '@/features/learning/management-provider';
import { useCompute } from '@/features/learning/compute-provider';
import { ComputeLesson } from '@/features/learning/compute';
import { computeHref, computeTopics, type ComputeTopic } from '@/domain/curriculum/compute';
import { computeNb } from '@/content/nb';
import { useCost } from '@/features/learning/cost-provider';
import { CostLesson } from '@/features/learning/cost';
import { costHref, costTopics, type CostTopic } from '@/domain/curriculum/cost';
import { costNb } from '@/content/nb';
import { useMissions } from './mission-provider';
import { MissionActivity } from './missions';
import { missionOrigin } from '@/domain/sandbox/missions';
import { ManagementTeachingBoundary } from '@/features/learning/management-access';
import { TransferAssessment, TransferEntry } from '@/features/learning/cloud-transfer';
import { useTransfer } from '@/features/learning/transfer-provider';
import { transferHref } from '@/domain/curriculum/transfer';
import { transferNb } from '@/content/nb';
import { ManagementLesson, CoreArchitectureJournal } from '@/features/learning/management';
import { managementTopics, isManagementTopic } from '@/domain/curriculum/architecture-management';
import { usePractical } from './practical-provider';
import { practicalHref } from '@/domain/sandbox/practical';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, ChevronRight, FlaskConical, Menu } from 'lucide-react';
import { labsNb, nb, serverlessNb, architectureNb, managementNb } from '@/content/nb';
import { unitIds } from '@/domain/curriculum/manifest';
import { topics, portalHref, parseLocation, type PortalLocation } from '@/domain/portal/model';
import {
  courseHref,
  courseLabHref,
  courseTopic,
  labFacts,
  startLab,
  type CourseModule,
} from '@/domain/course/model';
import { PracticalAssistance, PracticalOutcome } from './practical-lab';
import { useSandbox as useChapter } from '@/features/portal/sandbox-provider';
import { useLearning } from '@/features/learning/provider';
import { usePortalLearning } from '@/features/portal/learning-provider';
import {
  ServicesWorkspace,
  FoundationsWorkspace,
  ServiceReference,
  FoundationsReference,
} from '@/features/portal/learning';
import { PortalDialog } from '@/features/portal/shared';
import { ArchitectureExplorer } from '@/features/portal/architecture';
import { SavvyShark } from './savvy-shark';
import { MissionBriefing } from './mission-briefing';
import { useCourse } from './provider';
import { CourseNavigation } from './course-navigation';
import { ExpandedModule, ExpansionReference } from '@/features/learning/expanded-module';
import { useExpansion, ExpansionAssistance } from '@/features/learning/expansion-provider';
import { trackUnits } from '@/domain/curriculum/expansion';
import { manuscript } from '@/domain/curriculum/expansion-content';
import { FoundationsV2 } from '@/features/learning/foundations-v2';
import { useFoundationsV2 } from '@/features/learning/v2-provider';
import { isV2Topic, v2Topics } from '@/domain/curriculum/foundations-v2';
import '@/features/portal/portal.css';
import './course.css';
const c = nb.course;
import { useServerless } from '@/features/learning/serverless-provider';
import { ServerlessLesson } from '@/features/learning/serverless';
import { isServerlessTopic, serverlessTopics } from '@/domain/curriculum/serverless';
import { usePhysical } from '@/features/learning/physical-provider';
import { PhysicalLesson } from '@/features/learning/physical';
import { CourseHub, type HubRecord } from './course-hub';
import { CourseSidebar, type CourseActivities, type CourseDestinations } from './course-sidebar';
import { courseHubNb as hubCopy, missionsNb } from '@/content/nb';
import { physicalTopics, type PhysicalTopic } from '@/domain/curriculum/architecture-physical';
const names = {
  compute: computeNb.title,
  networking: networkingNb.title,
  connectivity: connectivityNb.title,
  storage: storageNb.title,
  identity: identityNb.title,
  'storage-resilience': storageResilienceNb.title,
  cost: costNb.title,
  architecture: architectureNb.title,
  computing: nb.official.computing,
  services: nb.official.services,
  benefits: nb.official.benefits,
};
export function Course({ module }: { module?: CourseModule }) {
  const missions = useMissions(),
    practical = usePractical(),
    serverless = useServerless(),
    physical = usePhysical(),
    management = useManagement(),
    transfer = useTransfer(),
    cost = useCost(),
    compute = useCompute(),
    networking = useNetworking(),
    connectivity = useConnectivity(),
    storage = useStorage(),
    resilience = useResilience(),
    identityState = useIdentity();
  const query = useSearchParams(),
    router = useRouter(),
    course = useCourse(),
    learning = useLearning(),
    services = usePortalLearning(),
    chapter = useChapter(),
    v2 = useFoundationsV2(),
    benefits = useExpansion('benefits'),
    service2 = useExpansion('services');
  const legacyServices =
    module === 'services' &&
    query.get('topic') !== 'transfer' &&
    (query.get('version') === '1' ||
      (query.get('version') === null && service2.facts.choice === 'v1'));
  const serviceChoice =
    module === 'services' &&
    !legacyServices &&
    services.save.events.length > 0 &&
    service2.facts.choice === null;
  const serviceHref = (t: string) =>
    `${courseHref('services', t)}${legacyServices ? '&version=1' : query.get('version') === '2' ? '&version=2' : ''}`;
  const topic =
    legacyServices && !(topics as readonly string[]).includes(query.get('topic') ?? 'overview')
      ? 'overview'
      : module
        ? courseTopic(module, query.get('topic'))
        : 'overview';
  useEffect(() => {
    if (
      module === 'services' &&
      !legacyServices &&
      services.ready &&
      service2.ready &&
      !services.save.events.length &&
      service2.facts.choice === null
    )
      service2.store.event({ kind: 'choose', version: 'v2' });
  }, [
    module,
    legacyServices,
    services.ready,
    services.save.events.length,
    service2.ready,
    service2.facts.choice,
    service2.store,
  ]);
  const currentV2 =
    module === 'computing' &&
    (isV2Topic(topic) || isServerlessTopic(topic) || topic === 'transfer');
  const hasV1 = learning.save.events.length > 0;
  const chooseVersion = topic !== 'transfer' && currentV2 && hasV1 && v2.save.choice === null;
  const computingEntry =
    hasV1 && v2.save.choice === 'v1'
      ? courseHref('computing', learning.facts.active ? 'assessment' : learning.save.unit)
      : courseHref('computing', 'intro-request');
  const labTopic =
    (module === 'services' && topic === 'practice') ||
    (module === 'computing' && topic === 'resource-bridge');
  const [briefing, setBriefing] = useState(false);
  const [journal, setJournal] = useState(false),
    [menu, setMenu] = useState(false);
  const labRef = useRef<HTMLElement>(null),
    debriefRef = useRef<HTMLElement>(null),
    activityRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      !module ||
      !course.ready ||
      chooseVersion ||
      ['lab', 'debrief', 'practical', 'mission'].includes(query.get('activity') ?? '')
    )
      return;
    let settled = 0;
    const frame = requestAnimationFrame(() => {
      settled = requestAnimationFrame(() => {
        const heading = activityRef.current?.querySelector<HTMLElement>(
          '[data-activity-heading], h2, h3',
        );
        if (heading) {
          heading.tabIndex = -1;
          const bounds = heading.getBoundingClientRect();
          // Keep visible context in short lessons; forced scrolling to an already
          // visible heading can push a sticky sidebar past its parent boundary.
          if (bounds.top < 84 || bounds.bottom > window.innerHeight - 120)
            heading.scrollIntoView({ block: 'start', behavior: 'instant' });
          heading.focus({ preventScroll: true });
        }
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settled);
    };
  }, [module, topic, course.ready, chooseVersion, query]);
  useEffect(() => {
    if (module && course.ready && !chooseVersion)
      course.store.update({ ...course.store.getSnapshot().save, resume: { module, topic } });
  }, [module, topic, course.ready, course.store, chooseVersion]);
  useEffect(() => {
    if ((!module && !journal) || chooseVersion) return;
    if (services.facts.active) services.store.event({ kind: 'aid' });
    if (
      learning.facts.active &&
      (journal || !(module === 'computing' && ['assessment', 'summary'].includes(topic)))
    )
      learning.store.event({ kind: 'aid' });
  }, [
    module,
    topic,
    journal,
    chooseVersion,
    services.facts.active,
    services.store,
    learning.facts.active,
    learning.store,
  ]);
  useEffect(() => {
    if (
      v2.facts.active &&
      (journal || (module && topic !== 'v2-assessment' && topic !== 'v2-summary'))
    )
      v2.store.event({ kind: 'aid' });
  }, [v2.facts.active, v2.store, module, topic, journal]);
  useEffect(() => {
    if (
      serverless.facts.active &&
      (journal || (module && topic !== 'serverless-assessment' && topic !== 'serverless-summary'))
    )
      serverless.store.event({ kind: 'aid' });
  }, [
    serverless.facts.active,
    serverless.ready,
    serverless.issue,
    serverless.store,
    journal,
    module,
    topic,
  ]);
  useEffect(() => {
    if (
      physical.facts.active &&
      (journal || (module && !(module === 'architecture' && topic === 'assessment')))
    )
      physical.store.event({ kind: 'aid' });
  }, [
    physical.facts.active,
    physical.ready,
    physical.issue,
    physical.store,
    journal,
    module,
    topic,
  ]);
  useEffect(() => {
    if (
      management.facts.active &&
      (journal || (module && !(module === 'architecture' && topic === 'management-assessment')))
    )
      management.store.event({ kind: 'aid' });
  }, [
    management.facts.active,
    management.ready,
    management.issue,
    management.store,
    journal,
    module,
    topic,
  ]);
  const lab = labFacts(course.save.lab, chapter.attempt.engine, chapter.attemptNumber);
  const existingSession = {
    ...startLab(chapter.attempt.engine, chapter.attemptNumber),
    boundary: null,
  };
  const existing = labFacts(existingSession, chapter.attempt.engine, chapter.attemptNumber);
  useEffect(() => {
    if (!course.ready || !chapter.ready || !labTopic) return;
    const scroll = () => {
      const activity = query.get('activity');
      if (activity === 'debrief' || activity === 'lab') {
        const target = activity === 'debrief' && lab.complete ? debriefRef.current : labRef.current;
        target?.scrollIntoView({ block: 'start', behavior: 'instant' });
        target?.focus({ preventScroll: true });
      }
    };
    let settledFrame = 0;
    const frame = requestAnimationFrame(() => {
      settledFrame = requestAnimationFrame(scroll);
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settledFrame);
    };
  }, [course.ready, chapter.ready, labTopic, lab.complete, query]);
  const preferredResume =
    course.save.resume ??
    (learning.save.events.length
      ? { module: 'computing' as const, topic: learning.save.unit }
      : null);
  const resumeHref =
    identityState.facts.active && identityState.facts.current
      ? identityHref('assessment', identityState.facts.current.item)
      : resilience.facts.active && resilience.facts.current
        ? resilienceHref('assessment', resilience.facts.current.item)
        : storage.facts.active && storage.facts.current
          ? storageHref('assessment', storage.facts.current.item)
          : connectivity.facts.active && connectivity.facts.current
            ? connectivityHref('assessment', connectivity.facts.current.item)
            : networking.facts.active && networking.facts.current
              ? networkingHref('assessment', networking.facts.current.item)
              : compute.facts.active && compute.facts.current
                ? computeHref('assessment', compute.facts.current.item)
                : cost.facts.active && cost.facts.current
                  ? costHref('assessment', cost.facts.current.item)
                  : transfer.facts.active && transfer.facts.current
                    ? transferHref(transfer.facts.current.item)
                    : missions.active && missions.activeSession
                      ? missionOrigin(missions.activeSession.mission)
                      : practical.activeIndependent && practical.current?.status === 'active'
                        ? practicalHref(practical.current, chapter.attempt.engine)
                        : management.facts.active
                          ? courseHref('architecture', 'management-assessment')
                          : physical.facts.active
                            ? courseHref('architecture', 'assessment')
                            : serverless.facts.active
                              ? courseHref('computing', 'serverless-assessment')
                              : v2.facts.active
                                ? courseHref('computing', 'v2-assessment')
                                : benefits.facts.active
                                  ? courseHref('benefits', 'assessment')
                                  : service2.facts.active
                                    ? courseHref('services', 'assessment')
                                    : services.facts.active
                                      ? '/portal?area=challenge&course=1&module=services&topic=practice'
                                      : learning.facts.active
                                        ? courseHref('computing', 'assessment')
                                        : practical.current?.status === 'active'
                                          ? practicalHref(practical.current, chapter.attempt.engine)
                                          : missions.activeSession
                                            ? missionOrigin(missions.activeSession.mission)
                                            : identityState.facts.guide &&
                                                (!preferredResume ||
                                                  preferredResume.module === 'identity')
                                              ? identityHref('studio') +
                                                '&perspective=' +
                                                identityState.facts.guide.mission
                                              : resilience.facts.guide &&
                                                  preferredResume?.module !== 'storage'
                                                ? resilienceHref('studio') +
                                                  '&perspective=' +
                                                  resilience.facts.guide.mission
                                                : storage.facts.guide
                                                  ? storageHref('studio') +
                                                    '&perspective=' +
                                                    storage.facts.guide.mission
                                                  : preferredResume
                                                    ? preferredResume.topic === 'transfer' &&
                                                      transfer.facts.current
                                                      ? transferHref(transfer.facts.current.item)
                                                      : preferredResume.module === 'cost' &&
                                                          preferredResume.topic === 'assessment' &&
                                                          cost.facts.current
                                                        ? costHref(
                                                            'assessment',
                                                            cost.facts.current.item,
                                                          )
                                                        : (preferredResume.module === 'services' &&
                                                              preferredResume.topic ===
                                                                'practice') ||
                                                            (preferredResume.module ===
                                                              'computing' &&
                                                              preferredResume.topic ===
                                                                'resource-bridge')
                                                          ? courseLabHref(
                                                              lab.complete,
                                                              course.save.lab?.origin,
                                                            )
                                                          : courseHref(
                                                              preferredResume.module,
                                                              preferredResume.topic,
                                                            )
                                                    : computingEntry;
  const navigate = (area: PortalLocation['area'], change: Partial<PortalLocation> = {}) => {
    if (area === 'learn')
      router.push(courseHref(change.module ?? module ?? 'services', change.topic ?? topic));
    else
      router.push(
        portalHref(parseLocation(new URLSearchParams()), area, {
          module:
            module === 'benefits' ||
            module === 'architecture' ||
            module === 'cost' ||
            module === 'compute' ||
            module === 'networking' ||
            module === 'storage' ||
            module === 'identity' ||
            module === 'storage-resilience' ||
            module === 'connectivity'
              ? 'services'
              : (module ?? 'services'),
          topic,
          course: true,
          ...change,
        }),
      );
  };
  const pathTopics: readonly string[] =
    module === 'identity'
      ? identityTopics
      : module === 'storage-resilience'
        ? resilienceTopics
        : module === 'storage'
          ? storageTopics
          : module === 'connectivity'
            ? connectivityTopics
            : module === 'networking'
              ? networkingTopics
              : module === 'compute'
                ? computeTopics
                : module === 'cost'
                  ? costTopics
                  : module === 'architecture'
                    ? [...physicalTopics, ...managementTopics]
                    : module === 'benefits'
                      ? [...trackUnits.benefits, 'summary', 'transfer']
                      : module === 'computing'
                        ? currentV2
                          ? [
                              ...v2Topics.slice(0, -1),
                              ...serverlessTopics,
                              v2Topics.at(-1)!,
                              'transfer',
                            ]
                          : [...unitIds, 'transfer']
                        : legacyServices
                          ? topics
                          : [...trackUnits.services, 'summary', 'transfer'];
  const index = pathTopics.indexOf(topic);
  const historicalReturn = pathTopics.filter((t) => t !== 'transfer').at(-1)!;
  const location = parseLocation(
    new URLSearchParams({ area: 'learn', module: module ?? 'services', topic }),
  );
  const title = (m: CourseModule, t: string) =>
    m === 'identity'
      ? identityNb.topics[t as IdentityTopic]
      : m === 'storage-resilience'
        ? storageResilienceNb.topics[t as ResilienceTopic]
        : m === 'storage'
          ? storageNb.topics[t as StorageTopic]
          : m === 'connectivity'
            ? connectivityNb.topics[t as ConnectivityTopic]
            : m === 'networking'
              ? networkingNb.topics[t as NetworkingTopic]
              : m === 'compute'
                ? computeNb.topics[t as ComputeTopic]
                : m === 'cost'
                  ? costNb.topics[t as CostTopic]
                  : t === 'transfer'
                    ? transferNb.entry
                    : m === 'architecture'
                      ? isManagementTopic(t)
                        ? managementNb.topics[t]
                        : architectureNb.topics[t as PhysicalTopic]
                      : m === 'benefits'
                        ? (manuscript('benefits', t)?.title ??
                          (t === 'summary'
                            ? nb.expansion.common.summary
                            : nb.expansion.common.assessment))
                        : m === 'services'
                          ? legacyServices
                            ? nb.portal.lesson.sections[t as (typeof topics)[number]]?.title
                            : (manuscript('services', t)?.title ??
                              (t === 'summary'
                                ? nb.expansion.common.summary
                                : nb.expansion.common.assessment))
                          : (serverlessNb.topics[t as keyof typeof serverlessNb.topics] ??
                            nb.foundationsV2.topics[t as (typeof v2Topics)[number]]?.title ??
                            nb.foundations.units[t as (typeof unitIds)[number]]?.title);
  const navigationDestinations: CourseDestinations = {
    computing: computingEntry,
    benefits: courseHref('benefits', 'availability'),
    services: serviceHref('overview'),
    architecture: courseHref('architecture', 'datacenters'),
    compute: computeHref('introduction'),
    networking: networkingHref('introduction'),
    connectivity: connectivityHref('introduction'),
    storage: storageHref('introduction'),
    identity: identityHref('introduction'),
    'storage-resilience': resilienceHref('introduction'),
    cost: costHref('introduction'),
  };
  const navigationTopics: Record<CourseModule, readonly string[]> = {
    computing:
      module === 'computing'
        ? pathTopics
        : hasV1 && v2.save.choice === 'v1'
          ? [...unitIds, 'transfer']
          : [...v2Topics.slice(0, -1), ...serverlessTopics, v2Topics.at(-1)!, 'transfer'],
    benefits: [...trackUnits.benefits, 'summary', 'transfer'],
    services: legacyServices ? topics : [...trackUnits.services, 'summary', 'transfer'],
    architecture: [...physicalTopics, ...managementTopics],
    compute: computeTopics,
    networking: networkingTopics,
    connectivity: connectivityTopics,
    storage: storageTopics,
    identity: identityTopics,
    'storage-resilience': resilienceTopics,
    cost: costTopics,
  };
  const hubRecords: HubRecord[] = [
    [
      'identity',
      hubCopy.recordLabels.identity,
      identityState,
      identityHref('assessment', identityState.facts.current?.item),
    ],
    [
      'resilience',
      hubCopy.recordLabels.resilience,
      resilience,
      resilienceHref('assessment', resilience.facts.current?.item),
    ],
    [
      'storage',
      hubCopy.recordLabels.storage,
      storage,
      storageHref('assessment', storage.facts.current?.item),
    ],
    ['course', hubCopy.recordLabels.course, course, '/learn'],
    ['chapter', hubCopy.recordLabels.chapter, chapter, '/portal'],
    ['learning', hubCopy.recordLabels.learning, learning, courseHref('computing', 'assessment')],
    ['v2', hubCopy.recordLabels.v2, v2, courseHref('computing', 'v2-assessment')],
    ['services', hubCopy.recordLabels.services, services, '/portal?area=challenge'],
    ['benefits', hubCopy.recordLabels.benefits, benefits, courseHref('benefits', 'assessment')],
    ['service2', hubCopy.recordLabels.service2, service2, courseHref('services', 'assessment')],
    [
      'serverless',
      hubCopy.recordLabels.serverless,
      serverless,
      courseHref('computing', 'serverless-assessment'),
    ],
    ['physical', hubCopy.recordLabels.physical, physical, courseHref('architecture', 'assessment')],
    [
      'management',
      hubCopy.recordLabels.management,
      management,
      courseHref('architecture', 'management-assessment'),
    ],
    [
      'transfer',
      hubCopy.recordLabels.transfer,
      transfer,
      transferHref(transfer.facts.current?.item ?? 'public-information'),
    ],
    ['practical', hubCopy.recordLabels.practical, practical, '/learn/services?topic=practice'],
    [
      'missions',
      hubCopy.recordLabels.missions,
      missions,
      missions.activeSession
        ? missionOrigin(missions.activeSession.mission)
        : '/learn/services?topic=iaas&activity=mission&version=2',
    ],
    [
      'compute',
      hubCopy.recordLabels.compute,
      compute,
      computeHref('assessment', compute.facts.current?.item),
    ],
    [
      'networking',
      hubCopy.recordLabels.networking,
      networking,
      networkingHref('assessment', networking.facts.current?.item),
    ],
    [
      'connectivity',
      hubCopy.recordLabels.connectivity,
      connectivity,
      connectivityHref('assessment', connectivity.facts.current?.item),
    ],
    ['cost', hubCopy.recordLabels.cost, cost, costHref('assessment', cost.facts.current?.item)],
  ].map(([id, label, state, href]) => {
    const record = state as { ready: boolean; issue: string | null; store: { load: () => void } };
    return {
      id: id as string,
      label: label as string,
      href: href as string,
      ready: record.ready,
      issue: record.issue,
      reload: record.store.load,
    };
  });
  const reliableHistory = hubRecords.every((record) => record.ready && !record.issue);
  const navigationActivities = Object.fromEntries(
    (Object.keys(navigationTopics) as CourseModule[]).map((part) => [
      part,
      navigationTopics[part].map((activity) => ({
        topic: activity,
        section:
          part === 'architecture'
            ? activity === physicalTopics[0]
              ? hubCopy.partA
              : activity === managementTopics[0]
                ? hubCopy.partB
                : undefined
            : undefined,
        title: title(part, activity) ?? activity,
        href: part === 'services' ? serviceHref(activity) : courseHref(part, activity),
        observed:
          reliableHistory &&
          part === 'computing' &&
          (isV2Topic(activity)
            ? v2.facts.guided(activity as (typeof v2Topics)[number])
            : !!learning.facts.observations[activity as (typeof unitIds)[number]]?.guided),
      })),
    ]),
  ) as unknown as CourseActivities;
  const activeIndependent =
    identityState.facts.active ||
    resilience.facts.active ||
    storage.facts.active ||
    connectivity.facts.active ||
    networking.facts.active ||
    compute.facts.active ||
    cost.facts.active ||
    transfer.facts.active ||
    missions.active ||
    practical.activeIndependent ||
    management.facts.active ||
    physical.facts.active ||
    serverless.facts.active ||
    v2.facts.active ||
    benefits.facts.active ||
    service2.facts.active ||
    services.facts.active ||
    learning.facts.active;
  const hasResume =
    activeIndependent ||
    !!preferredResume ||
    !!storage.facts.guide ||
    !!identityState.facts.guide ||
    !!resilience.facts.guide ||
    !!missions.activeSession ||
    practical.current?.status === 'active';
  const entryDestinations: CourseDestinations = {
    ...navigationDestinations,
    identity: identityHref(
      identityState.facts.active ? 'assessment' : identityState.facts.topic,
      identityState.facts.current?.item,
    ),
    'storage-resilience': resilienceHref(
      resilience.facts.active ? 'assessment' : resilience.facts.topic,
      resilience.facts.current?.item,
    ),
    storage: storageHref(
      storage.facts.active ? 'assessment' : storage.facts.topic,
      storage.facts.current?.item,
    ),
    architecture: courseHref(
      'architecture',
      management.facts.active
        ? 'management-assessment'
        : physical.facts.active
          ? 'assessment'
          : (management.facts.lastTopic ?? physical.facts.lastTopic ?? 'datacenters'),
    ),
    compute: computeHref(
      compute.facts.active ? 'assessment' : compute.facts.topic,
      compute.facts.current?.item,
    ),
    networking: networkingHref(
      networking.facts.active ? 'assessment' : networking.facts.topic,
      networking.facts.current?.item,
    ),
    connectivity: connectivityHref(
      connectivity.facts.active ? 'assessment' : connectivity.facts.topic,
      connectivity.facts.current?.item,
    ),
    cost: costHref(cost.facts.active ? 'assessment' : cost.facts.topic, cost.facts.current?.item),
  };
  const guidedCount = (count: number) => `${hubCopy.guided}: ${count}`;
  const hubObservations: Record<CourseModule, string> = {
    computing: guidedCount(
      hasV1 && v2.save.choice !== 'v2'
        ? unitIds.filter((id) => learning.facts.observations[id].guided).length
        : v2Topics.filter((id) => v2.facts.guided(id)).length,
    ),
    benefits: guidedCount(trackUnits.benefits.filter((id) => benefits.facts.guided(id)).length),
    services: guidedCount(
      trackUnits.services.filter((id) => id !== 'practice' && service2.facts.guided(id)).length,
    ),
    architecture: `${hubCopy.coreObservation}: ${Number(physical.facts.guided)} · ${hubCopy.coreObservationB}: ${Number(management.facts.guided)}`,
    compute: guidedCount(compute.facts.completed.length),
    networking: guidedCount(networking.facts.completed.length),
    connectivity: guidedCount(connectivity.facts.completed.length),
    storage: guidedCount(storage.facts.completed.length),
    identity: guidedCount(identityState.facts.completed.length),
    'storage-resilience': guidedCount(resilience.facts.completed.length),
    cost: guidedCount(cost.facts.completed.length),
  };
  const begin = () => {
    if (missions.active) return;
    if (services.facts.active) services.store.event({ kind: 'aid' });
    if (learning.facts.active) learning.store.event({ kind: 'aid' });
    const session =
      course.save.lab && lab.verifiable
        ? course.save.lab
        : startLab(chapter.attempt.engine, chapter.attemptNumber);
    if (
      course.store.update({
        ...course.save,
        lab: {
          ...session,
          origin:
            module === 'architecture'
              ? 'architecture-management'
              : module === 'computing'
                ? 'computing-v2'
                : legacyServices
                  ? 'services-v1'
                  : 'services-v2',
        },
      })
    )
      router.push('/portal?lab=web-platform&mode=guided&module=services&topic=practice');
  };
  return (
    <div
      className={`portal course-shell ${module === 'identity' || module === 'storage-resilience' || module === 'storage' || module === 'connectivity' || module === 'networking' || module === 'compute' || module === 'cost' || module === 'architecture' || currentV2 || module === 'benefits' || (module === 'services' && !legacyServices) ? 'course-v2' : ''}`}
    >
      <ExpansionAssistance />
      <PracticalAssistance />
      <a className="portal-skip" href="#course-main">
        {nb.shell.skip}
      </a>
      <header className="course-header">
        <Link className="course-brand" href="/learn">
          <BookOpen size={23} />
          {c.brand}
          <small>AZ-900</small>
        </Link>
        <nav aria-label={c.home}>
          <Link href="/learn">{c.home}</Link>
          <Link href="/portal">
            <FlaskConical size={16} />
            {c.sandbox}
          </Link>
        </nav>
        <button
          type="button"
          onClick={() => {
            if (!management.store.prepareTeaching()) return;
            if (services.facts.active) services.store.event({ kind: 'aid' });
            if (practical.activeIndependent) practical.store.event({ type: 'aid' });
            setJournal(true);
          }}
        >
          {c.journal}
        </button>
      </header>
      <div className="course-layout">
        <aside className={`course-navigation ${menu ? 'course-menu-open' : ''}`}>
          <button
            className="course-menu-toggle"
            type="button"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Menu size={18} />
            {c.learning}
          </button>
          <CourseSidebar
            key={module ?? 'hub'}
            module={module}
            topic={topic}
            destinations={navigationDestinations}
            activities={navigationActivities}
            onNavigate={() => setMenu(false)}
          />
        </aside>
        <main id="course-main" className="course-main">
          {course.issue && (
            <div role="status" className="course-storage">
              <p>
                {c.storeIssue} ({course.issue})
              </p>
              <button type="button" onClick={course.store.load}>
                {c.reload}
              </button>
              {course.issue !== 'unsaved' && (
                <button type="button" onClick={course.store.clear}>
                  {c.clear}
                </button>
              )}
            </div>
          )}
          {v2.issue && (
            <div className="course-storage" role="status">
              <p>
                {nb.foundationsV2.storage} ({v2.issue})
              </p>
              <button type="button" onClick={v2.store.load}>
                {c.reload}
              </button>
              <button type="button" onClick={v2.store.clear}>
                {nb.foundationsV2.reset}
              </button>
            </div>
          )}
          <ManagementTeachingBoundary
            identity={`course:${module}:${topic}`}
            orientation={!module}
            only={
              topic !== 'transfer' &&
              module &&
              module !== 'architecture' &&
              module !== 'cost' &&
              module !== 'compute' &&
              module !== 'networking' &&
              module !== 'storage' &&
              module !== 'identity' &&
              module !== 'storage-resilience' &&
              module !== 'connectivity'
                ? 'core'
                : undefined
            }
            assessment={
              module === 'identity' && topic === 'assessment'
                ? 'identity'
                : module === 'storage-resilience' && topic === 'assessment'
                  ? 'resilience'
                  : module === 'storage' && topic === 'assessment'
                    ? 'storage'
                    : module === 'connectivity' && topic === 'assessment'
                      ? 'connectivity'
                      : module === 'networking' && topic === 'assessment'
                        ? 'networking'
                        : module === 'compute' && topic === 'assessment'
                          ? 'compute'
                          : module === 'cost' && topic === 'assessment'
                            ? 'cost'
                            : topic === 'transfer'
                              ? 'transfer'
                              : module && missions.active && !missions.assisted
                                ? 'missions'
                                : module === 'architecture' && topic === 'management-assessment'
                                  ? 'management'
                                  : module === 'architecture' && topic === 'assessment'
                                    ? 'physical'
                                    : undefined
            }
          >
            {!module ? (
              <CourseHub
                resumeHref={resumeHref}
                resumeLabel={
                  activeIndependent ? nb.portal.continueChallenge : hasResume ? c.resume : c.begin
                }
                activeIndependent={activeIndependent}
                hasResume={hasResume}
                destinations={entryDestinations}
                observations={hubObservations}
                records={hubRecords}
                onServiceLab={() => service2.store.event({ kind: 'choose', version: 'v2' })}
                missionResume={
                  missions.ready && !missions.issue && missions.activeSession
                    ? {
                        href: missionOrigin(missions.activeSession.mission),
                        title: missionsNb.missions[missions.activeSession.mission].title,
                      }
                    : undefined
                }
              />
            ) : topic !== 'transfer' && missions.active && !missions.assisted ? (
              <MissionActivity />
            ) : topic !== 'transfer' &&
              practical.activeIndependent &&
              practical.current &&
              !practical.current.aided ? (
              <section className="practical-entry">
                <small>{labsNb.independent}</small>
                <h1>{labsNb.lab[practical.current.kind].title}</h1>
                <p>{labsNb.lab[practical.current.kind].changed}</p>
                <Link
                  className="course-primary"
                  href={practicalHref(practical.current, chapter.attempt.engine)}
                >
                  {labsNb.resume}
                </Link>
                <PracticalOutcome />
              </section>
            ) : (
              <>
                <div className="course-breadcrumb">
                  <Link href="/learn">{c.overview}</Link>
                  <ChevronRight size={14} />
                  <span>{names[module]}</span>
                </div>
                <header className="course-module-header">
                  <small>
                    {c.module}{' '}
                    {module === 'identity'
                      ? identityNb.part
                      : module === 'storage-resilience'
                        ? storageResilienceNb.part
                        : module === 'storage'
                          ? '08'
                          : module === 'connectivity'
                            ? '07'
                            : module === 'networking'
                              ? '06'
                              : module === 'compute'
                                ? '05'
                                : module === 'cost'
                                  ? '06'
                                  : module === 'architecture'
                                    ? '04'
                                    : module === 'computing'
                                      ? '01'
                                      : module === 'benefits'
                                        ? '02'
                                        : '03'}{' '}
                    · {module === 'architecture' ? managementNb.available : c.available}
                  </small>
                  <h1>{names[module]}</h1>
                  <p>
                    {module === 'identity'
                      ? identityNb.overview
                      : module === 'storage-resilience'
                        ? storageResilienceNb.overview
                        : module === 'storage'
                          ? storageNb.overview
                          : module === 'connectivity'
                            ? connectivityNb.overview
                            : module === 'networking'
                              ? networkingNb.overview
                              : module === 'compute'
                                ? computeNb.overview
                                : module === 'cost'
                                  ? costNb.overview
                                  : module === 'architecture'
                                    ? managementNb.intro
                                    : module === 'benefits'
                                      ? nb.expansion.benefits.intro
                                      : module === 'services'
                                        ? c.services
                                        : currentV2
                                          ? nb.foundationsV2.intro
                                          : c.computing}
                  </p>
                </header>
                {services.facts.active && (
                  <p className="course-assessment-warning">
                    {c.activeAssessment}{' '}
                    <button
                      type="button"
                      onClick={() => navigate('challenge', { mode: 'independent', lab: undefined })}
                    >
                      {nb.portal.continueChallenge}
                    </button>
                  </p>
                )}
                <div ref={activityRef} className="course-activity">
                  {module === 'identity' ? (
                    <IdentityLesson
                      topic={topic as IdentityTopic}
                      selected={query.get('case')}
                      perspective={query.get('perspective')}
                    />
                  ) : module === 'storage-resilience' ? (
                    <ResilienceLesson
                      topic={topic as ResilienceTopic}
                      selected={query.get('case')}
                      perspective={query.get('perspective')}
                    />
                  ) : module === 'storage' ? (
                    <StorageLesson
                      topic={topic as StorageTopic}
                      selected={query.get('case')}
                      perspective={query.get('perspective')}
                    />
                  ) : module === 'connectivity' ? (
                    <ConnectivityLesson
                      topic={topic as ConnectivityTopic}
                      selected={query.get('case')}
                    />
                  ) : module === 'networking' ? (
                    <NetworkingLesson
                      topic={topic as NetworkingTopic}
                      selected={query.get('case')}
                    />
                  ) : module === 'compute' ? (
                    <ComputeLesson topic={topic as ComputeTopic} selected={query.get('case')} />
                  ) : module === 'cost' ? (
                    <CostLesson topic={topic as CostTopic} selected={query.get('case')} />
                  ) : topic === 'transfer' && module !== 'architecture' ? (
                    <TransferAssessment module={module} selected={query.get('case')} />
                  ) : chooseVersion ? (
                    <section className="course-version-choice">
                      <h2>{nb.foundationsV2.chooseTitle}</h2>
                      <p>{nb.foundationsV2.chooseText}</p>
                      {learning.facts.active && <p>{nb.foundationsV2.activeWarning}</p>}
                      <button
                        type="button"
                        onClick={() => {
                          v2.store.choose('v1');
                          router.push(
                            courseHref(
                              'computing',
                              learning.facts.active ? 'assessment' : learning.save.unit,
                            ),
                          );
                        }}
                      >
                        {nb.foundationsV2.keepV1}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (learning.facts.active) learning.store.event({ kind: 'aid' });
                          v2.store.choose('v2');
                          router.push(courseHref('computing', 'intro-request'));
                        }}
                      >
                        {nb.foundationsV2.startV2}
                      </button>
                    </section>
                  ) : module === 'architecture' && isManagementTopic(topic) ? (
                    <ManagementLesson
                      key={topic}
                      topic={topic}
                      onLab={() => (course.save.lab ? begin() : setBriefing(true))}
                      guidanceBlocked={
                        [
                          learning,
                          v2,
                          services,
                          benefits,
                          service2,
                          practical,
                          chapter,
                          course,
                          serverless,
                          physical,
                          management,
                          missions,
                          transfer,
                          cost,
                          compute,
                          networking,
                          connectivity,
                          storage,
                          identityState,
                          resilience,
                        ].some((x) => !x.ready || !!x.issue) ||
                        learning.facts.active ||
                        v2.facts.active ||
                        services.facts.active ||
                        benefits.facts.active ||
                        service2.facts.active ||
                        practical.activeIndependent ||
                        serverless.facts.active ||
                        physical.facts.active ||
                        transfer.facts.active ||
                        networking.facts.active ||
                        connectivity.facts.active ||
                        identityState.facts.active ||
                        resilience.facts.active ||
                        storage.facts.active ||
                        compute.facts.active ||
                        cost.facts.active ||
                        missions.active
                      }
                    />
                  ) : module === 'architecture' ? (
                    <PhysicalLesson
                      key={topic}
                      topic={topic as PhysicalTopic}
                      guidanceBlocked={
                        [
                          learning,
                          v2,
                          services,
                          benefits,
                          service2,
                          practical,
                          chapter,
                          course,
                          serverless,
                          physical,
                          management,
                          missions,
                          transfer,
                          cost,
                          compute,
                          networking,
                          connectivity,
                          storage,
                          identityState,
                          resilience,
                        ].some((x) => !x.ready || !!x.issue) ||
                        learning.facts.active ||
                        v2.facts.active ||
                        services.facts.active ||
                        benefits.facts.active ||
                        service2.facts.active ||
                        serverless.facts.active ||
                        practical.activeIndependent ||
                        management.facts.active ||
                        transfer.facts.active ||
                        networking.facts.active ||
                        connectivity.facts.active ||
                        identityState.facts.active ||
                        resilience.facts.active ||
                        storage.facts.active ||
                        compute.facts.active ||
                        cost.facts.active ||
                        missions.active
                      }
                    />
                  ) : module === 'benefits' ? (
                    <ExpandedModule key={topic} track="benefits" topic={topic} />
                  ) : module === 'computing' && isServerlessTopic(topic) ? (
                    <ServerlessLesson
                      key={topic}
                      topic={topic}
                      guidanceBlocked={
                        [
                          learning,
                          v2,
                          services,
                          benefits,
                          service2,
                          practical,
                          chapter,
                          course,
                          serverless,
                          physical,
                          management,
                          missions,
                          transfer,
                          cost,
                          compute,
                          networking,
                          connectivity,
                          storage,
                          identityState,
                          resilience,
                        ].some((x) => !x.ready || !!x.issue) ||
                        learning.facts.active ||
                        v2.facts.active ||
                        services.facts.active ||
                        benefits.facts.active ||
                        service2.facts.active ||
                        practical.activeIndependent ||
                        physical.facts.active ||
                        management.facts.active ||
                        transfer.facts.active ||
                        networking.facts.active ||
                        connectivity.facts.active ||
                        identityState.facts.active ||
                        resilience.facts.active ||
                        storage.facts.active ||
                        compute.facts.active ||
                        cost.facts.active ||
                        missions.active
                      }
                    />
                  ) : module === 'computing' && currentV2 ? (
                    <FoundationsV2 key={topic} topic={topic} />
                  ) : module === 'services' ? (
                    serviceChoice ? (
                      <section className="course-version-choice">
                        <h2>{nb.expansion.common.choiceTitle}</h2>
                        <p>{nb.expansion.common.choiceText}</p>
                        <button
                          onClick={() => {
                            service2.store.event({ kind: 'choose', version: 'v1' });
                            router.push(`${courseHref('services', 'overview')}&version=1`);
                          }}
                        >
                          {nb.expansion.common.keepLegacy}
                        </button>
                        <button
                          onClick={() => service2.store.event({ kind: 'choose', version: 'v2' })}
                        >
                          {nb.expansion.common.startCurrent}
                        </button>
                      </section>
                    ) : (
                      <>
                        {legacyServices ? (
                          <section className="course-legacy-note">
                            <strong>{nb.expansion.common.legacy}</strong>
                            <p>{nb.expansion.common.legacyWarning}</p>
                            <button
                              onClick={() => {
                                service2.store.event({ kind: 'choose', version: 'v2' });
                                router.push(courseHref('services', 'overview'));
                              }}
                            >
                              {nb.expansion.common.viewCurrent}
                            </button>
                          </section>
                        ) : (
                          <Link href={`${courseHref('services', 'overview')}&version=1`}>
                            {nb.expansion.common.viewLegacy}
                          </Link>
                        )}
                        {['assessment', 'summary'].includes(topic) ? (
                          <ExpandedModule
                            key={topic}
                            track="services"
                            topic={topic}
                            technicalReady={lab.complete}
                          />
                        ) : (
                          <ServicesWorkspace
                            key={topic}
                            location={location}
                            navigate={navigate}
                            course
                            operational={!legacyServices}
                            extension={
                              !legacyServices ? (
                                <ExpandedModule
                                  track="services"
                                  topic={topic}
                                  embedded
                                  technicalReady={lab.complete}
                                />
                              ) : undefined
                            }
                          />
                        )}
                      </>
                    )
                  ) : (
                    <>
                      <section className="course-legacy-note">
                        <strong>{nb.foundationsV2.legacy}</strong>
                        <p>{nb.foundationsV2.legacyNote}</p>
                        {learning.facts.active && <p>{nb.foundationsV2.activeWarning}</p>}
                        <button
                          onClick={() => {
                            v2.store.choose('v2');
                            router.push(courseHref('computing', 'intro-request'));
                          }}
                        >
                          {nb.foundationsV2.switchV2}
                        </button>
                      </section>
                      <FoundationsWorkspace location={location} navigate={navigate} />
                    </>
                  )}
                </div>
                {module === 'networking' && topic === 'summary' && (
                  <nav className="compute-actions" aria-label={connectivityNb.title}>
                    <Link href={connectivityHref('introduction')}>{connectivityNb.title} →</Link>
                  </nav>
                )}
                {module === 'connectivity' && (topic === 'introduction' || topic === 'summary') && (
                  <nav className="compute-actions" aria-label={networkingNb.title}>
                    <Link href={networkingHref('summary')}>
                      {networkingNb.title} · {networkingNb.partA}
                    </Link>
                  </nav>
                )}
                {module !== 'compute' &&
                  module !== 'networking' &&
                  module !== 'storage' &&
                  module !== 'identity' &&
                  module !== 'storage-resilience' &&
                  module !== 'connectivity' &&
                  module !== 'cost' &&
                  module !== 'architecture' &&
                  topic !== 'transfer' && <TransferEntry module={module} />}
                {labTopic && !chooseVersion && !serviceChoice && (
                  <section
                    className="course-lab"
                    id="practical-lab"
                    ref={labRef}
                    tabIndex={-1}
                    aria-labelledby="course-lab-title"
                  >
                    <span>{c.guided}</span>
                    <h2 id="course-lab-title">{c.labTitle}</h2>
                    <p>{c.labIntro}</p>
                    <p>{c.labBridge}</p>
                    <SavvyShark>
                      <p>{c.labExpect}</p>
                    </SavvyShark>
                    {!course.save.lab && existing.group && (
                      <div>
                        <p>{nb.expansion.common.existingLabNote}</p>
                        <button
                          onClick={() =>
                            course.store.update({
                              ...course.save,
                              lab: {
                                ...existingSession,
                                origin:
                                  module === 'computing'
                                    ? 'computing-v2'
                                    : legacyServices
                                      ? 'services-v1'
                                      : 'services-v2',
                              },
                            })
                          }
                        >
                          {nb.expansion.common.existingLab}
                        </button>
                      </div>
                    )}
                    {course.save.lab && (
                      <p role="status">
                        {lab.complete
                          ? c.satisfied
                          : !lab.verifiable
                            ? c.guidance.unverifiable[1]
                            : c.unfinished}
                      </p>
                    )}
                    {lab.complete ? (
                      <section
                        className="course-debrief"
                        id="lab-debrief"
                        ref={debriefRef}
                        tabIndex={-1}
                        aria-label={c.debrief}
                      >
                        <h3>{c.debrief}</h3>
                        <p>{c.debriefText}</p>
                        <dl className="portal-properties">
                          <div>
                            <dt>{nb.portal.group}</dt>
                            <dd>{lab.group?.name}</dd>
                          </div>
                          <div>
                            <dt>{nb.portal.plan}</dt>
                            <dd>{lab.plan?.name}</dd>
                          </div>
                          <div>
                            <dt>{nb.portal.areas.apps}</dt>
                            <dd>{lab.app?.name}</dd>
                          </div>
                        </dl>
                        <Reflection />
                        <p>{c.notMastery}</p>
                        <button
                          type="button"
                          onClick={() =>
                            navigate('challenge', { mode: 'independent', lab: undefined })
                          }
                        >
                          {c.startIndependent}
                        </button>
                      </section>
                    ) : null}
                    <button
                      type="button"
                      className={lab.complete ? undefined : 'primary'}
                      data-course-ready={course.ready}
                      data-world-ready={chapter.ready}
                      data-course-issue={course.issue ?? ''}
                      disabled={
                        !course.ready ||
                        !chapter.ready ||
                        ['corrupt', 'unsupported', 'conflict'].includes(course.issue ?? '') ||
                        services.facts.active ||
                        benefits.facts.active ||
                        service2.facts.active
                      }
                      onClick={() =>
                        module === 'services' && !course.save.lab ? setBriefing(true) : begin()
                      }
                    >
                      {lab.complete
                        ? nb.refinement.revisitLab
                        : course.save.lab && lab.verifiable
                          ? c.resumeLab
                          : c.startLab}
                    </button>
                  </section>
                )}
                {briefing && (
                  <MissionBriefing
                    kind="paas"
                    onClose={() => setBriefing(false)}
                    onStart={() => {
                      setBriefing(false);
                      begin();
                    }}
                  />
                )}
                {module === 'services' && topic !== 'practice' && topic !== 'transfer' && (
                  <details className="course-guide-note">
                    <summary>
                      {c.assistant} · {c.assistantRole}
                    </summary>
                    <SavvyShark compact>
                      <p>{c.theoryGuide}</p>
                    </SavvyShark>
                  </details>
                )}
                {module === 'services' && topic === 'practice' && (
                  <details>
                    <summary>{nb.portal.areas.hierarchy}</summary>
                    <ArchitectureExplorer
                      world={chapter.attempt.engine.world}
                      lens="hierarchy"
                      navigate={navigate}
                    />
                  </details>
                )}
                {module === 'computing' && currentV2 && hasV1 && !chooseVersion && (
                  <Link
                    href={courseHref(
                      'computing',
                      learning.facts.active ? 'assessment' : learning.save.unit,
                    )}
                  >
                    {nb.foundationsV2.viewV1}
                  </Link>
                )}
                {!chooseVersion && !serviceChoice && (
                  <>
                    {((currentV2 && index === pathTopics.length - 1) ||
                      (module === 'benefits' && topic === 'summary')) && (
                      <SavvyShark compact>
                        <p>
                          {currentV2
                            ? nb.expansion.common.nextBenefits
                            : nb.expansion.common.nextServices}
                        </p>
                      </SavvyShark>
                    )}
                    <CourseNavigation
                      moduleName={names[module]}
                      current={
                        title(module, topic) ??
                        (topic.includes('summary')
                          ? nb.foundationsV2.summary
                          : nb.foundationsV2.assessment)
                      }
                      index={index}
                      count={pathTopics.length}
                      previous={
                        index > 0
                          ? {
                              href:
                                module === 'services'
                                  ? serviceHref(pathTopics[index - 1]!)
                                  : courseHref(module, pathTopics[index - 1]!),
                              title: title(module, pathTopics[index - 1]!)!,
                            }
                          : index < 0
                            ? {
                                href: courseHref(module, historicalReturn),
                                title: title(module, historicalReturn)!,
                              }
                            : module === 'identity'
                              ? {
                                  href: resilienceHref('summary'),
                                  title: names['storage-resilience'],
                                }
                              : module === 'storage-resilience'
                                ? { href: storageHref('summary'), title: names.storage }
                                : module === 'storage'
                                  ? { href: connectivityHref('summary'), title: names.connectivity }
                                  : module === 'connectivity'
                                    ? { href: networkingHref('summary'), title: names.networking }
                                    : module === 'networking'
                                      ? { href: computeHref('summary'), title: names.compute }
                                      : module === 'compute'
                                        ? {
                                            href: courseHref('architecture', 'core-summary'),
                                            title: names.architecture,
                                          }
                                        : module === 'architecture'
                                          ? {
                                              href: courseHref('services', 'summary'),
                                              title: names.services,
                                            }
                                          : undefined
                      }
                      next={
                        index >= 0 && index < pathTopics.length - 1
                          ? {
                              href:
                                module === 'services'
                                  ? serviceHref(pathTopics[index + 1]!)
                                  : courseHref(module, pathTopics[index + 1]!),
                              title: title(module, pathTopics[index + 1]!)!,
                            }
                          : index === pathTopics.length - 1
                            ? {
                                href:
                                  module === 'storage-resilience'
                                    ? identityHref('introduction')
                                    : module === 'storage'
                                      ? resilienceHref('introduction')
                                      : module === 'connectivity'
                                        ? storageHref('introduction')
                                        : module === 'networking'
                                          ? connectivityHref('introduction')
                                          : module === 'compute'
                                            ? networkingHref('introduction')
                                            : module === 'architecture'
                                              ? computeHref('introduction')
                                              : currentV2
                                                ? courseHref('benefits', 'availability')
                                                : module === 'benefits'
                                                  ? courseHref('services', 'overview')
                                                  : module === 'services' && !legacyServices
                                                    ? courseHref('architecture', 'datacenters')
                                                    : '/learn',
                                title:
                                  module === 'storage-resilience'
                                    ? identityNb.title
                                    : module === 'storage'
                                      ? storageResilienceNb.title
                                      : module === 'connectivity'
                                        ? storageNb.title
                                        : module === 'networking'
                                          ? connectivityNb.title
                                          : module === 'compute'
                                            ? networkingNb.title
                                            : module === 'architecture'
                                              ? computeNb.title
                                              : currentV2
                                                ? names.benefits
                                                : module === 'benefits'
                                                  ? names.services
                                                  : module === 'services' && !legacyServices
                                                    ? names.architecture
                                                    : c.overview,
                              }
                            : undefined
                      }
                      continueTeaching={labTopic && lab.complete}
                      summary={topic.includes('summary')}
                    />
                  </>
                )}
              </>
            )}
          </ManagementTeachingBoundary>
          <footer className="course-footer">{nb.portal.boundary}</footer>
        </main>
      </div>
      {journal && (
        <PortalDialog title={c.journal} onClose={() => setJournal(false)}>
          <ManagementTeachingBoundary identity="course-journal">
            {module === 'identity' || (!module && preferredResume?.module === 'identity') ? (
              <IdentityLesson topic="introduction" journal />
            ) : module === 'storage-resilience' ||
              (!module && preferredResume?.module === 'storage-resilience') ? (
              <ResilienceLesson topic="introduction" journal />
            ) : module === 'storage' || (!module && preferredResume?.module === 'storage') ? (
              <StorageLesson topic="introduction" journal />
            ) : module === 'connectivity' ||
              (!module && preferredResume?.module === 'connectivity') ? (
              <ConnectivityLesson topic="introduction" journal />
            ) : module === 'networking' || (!module && preferredResume?.module === 'networking') ? (
              <NetworkingLesson topic="introduction" journal />
            ) : module === 'compute' || (!module && preferredResume?.module === 'compute') ? (
              <ComputeLesson topic="introduction" journal />
            ) : module === 'cost' || (!module && preferredResume?.module === 'cost') ? (
              <CostLesson topic="introduction" journal />
            ) : module === 'architecture' ||
              (!module && preferredResume?.module === 'architecture') ? (
              <CoreArchitectureJournal />
            ) : module === 'benefits' ? (
              <ExpansionReference track="benefits" topic={topic} />
            ) : module === 'services' && !legacyServices ? (
              <ExpansionReference track="services" topic={topic} />
            ) : isServerlessTopic(topic) ? (
              <ServerlessLesson topic={topic} journal />
            ) : currentV2 ? (
              <FoundationsV2
                topic={['v2-assessment', 'v2-summary'].includes(topic) ? 'intro-request' : topic}
                journal
              />
            ) : module === 'computing' || (!module && preferredResume?.module === 'computing') ? (
              <FoundationsReference topic={topic} />
            ) : (
              <ServiceReference topic={topic} />
            )}
          </ManagementTeachingBoundary>
        </PortalDialog>
      )}
    </div>
  );
}
function Reflection() {
  const { save, store } = useCourse();
  const [answer, setAnswer] = useState('');
  const choice = save.lab?.reflection;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (save.lab && (answer === 'data' || answer === 'provider'))
          store.update({ ...save, lab: { ...save.lab, reflection: answer } });
      }}
    >
      <fieldset>
        <legend>{c.reflection}</legend>
        <label>
          <input
            type="radio"
            name="reflection"
            required
            checked={answer === 'data'}
            onChange={() => setAnswer('data')}
          />
          <span>{c.reflectionData}</span>
        </label>
        <label>
          <input
            type="radio"
            name="reflection"
            checked={answer === 'provider'}
            onChange={() => setAnswer('provider')}
          />
          <span>{c.reflectionProvider}</span>
        </label>
        <button type="submit">{c.checkReflection}</button>
      </fieldset>
      {choice && <p role="status">{choice === 'data' ? c.reflectionCorrect : c.reflectionWrong}</p>}
    </form>
  );
}
